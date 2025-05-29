import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getEbayScraper, type CarListing } from '@/lib/scrapers/ebay-scraper';
import { getCarsApiScraper } from '@/lib/scrapers/cars-api';
import { getMultiPlatformScraper } from '@/lib/scrapers/multi-platform-scraper';
import { getRealVehicleAPI } from '@/lib/scrapers/real-vehicle-api';
import OpenAI from 'openai';

interface AISearchRequest {
  query: string;
  postcode?: string;
  radius?: string;
}

interface CarFilters {
  budget?: {
    min?: number;
    max?: number;
  };
  make?: string[];
  bodyType?: string[];
  fuelType?: string[];
  transmission?: string[];
  yearFrom?: number;
  yearTo?: number;
  mileageMax?: number;
  features?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { query, postcode, radius }: AISearchRequest = await request.json();

    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // First get ChatGPT recommendations to understand user intent
    const chatGptRecommendations = await generateCarRecommendations(query);

    // Then search for real vehicles that match the intent
    const realListings = await searchForRealVehicles(query, postcode, radius);

    // Combine ChatGPT insights with real listings
    const listings = realListings.length > 0 ? realListings : chatGptRecommendations;

    // Create simple filters for the response (for compatibility)
    const filters = { query: query };

    // Analyze data sources and quality
    const sources = [...new Set(listings.map(l => l.source).filter(Boolean))];
    const hasRealDVLAData = sources.some(s => s === 'DVLA Verified Data');
    const hasDemoData = sources.some(s => s?.includes('Demo Data'));
    const isRealListings = realListings.length > 0;

    let dataQuality = '';
    let interpretation = '';

    if (hasRealDVLAData) {
      dataQuality = 'DVLA Verified Real Data';
      interpretation = `🏛️ **DVLA Verified Data** - Found ${listings.length} real vehicles with official government data`;
    } else if (hasDemoData || !isRealListings) {
      dataQuality = 'Demo Data (Realistic Simulation)';
      interpretation = `🎭 **Demo Mode** - Generated ${listings.length} realistic vehicle listings for demonstration`;
    } else {
      dataQuality = 'Multi-Platform Search Data';
      interpretation = `🚗 **Multi-Platform Search** - Found ${listings.length} vehicles from ${sources.length} sources: ${sources.join(' & ')}`;
    }

    console.log(`📊 Data Quality: ${dataQuality}, Sources: ${sources.join(', ')}`);

    // Save search to database if user is authenticated
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        await db.search.create({
          data: {
            userId: session.user.id,
            query: query,
            filters: {
              query,
              postcode,
              radius,
              interpretation,
              aiPowered: !!process.env.OPENAI_API_KEY
            },
            results: {
              listings: listings.slice(0, 10), // Save first 10 results to avoid large JSON
              totalCount: listings.length,
              dataQuality,
              sources,
              platformCount: sources.length
            }
          }
        });
        console.log(`💾 Search saved for user ${session.user.id}: "${query}"`);
      }
    } catch (saveError) {
      console.error('Error saving search:', saveError);
      // Don't fail the request if saving fails
    }

    return NextResponse.json({
      success: true,
      filters,
      listings,
      vehicles: listings, // For backward compatibility
      interpretation,
      aiPowered: !!process.env.OPENAI_API_KEY,
      realListings: hasRealDVLAData,
      dataType: hasRealDVLAData ? 'real' : 'demo',
      dataQuality,
      sources,
      platformCount: sources.length
    });

  } catch (error) {
    console.error('AI search error:', error);
    return NextResponse.json(
      { error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}

async function extractFiltersFromQuery(query: string): Promise<CarFilters> {
  // If OpenAI API key is not configured, fall back to basic keyword matching
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using basic keyword matching');
    return extractFiltersBasic(query);
  }

  try {
    // Initialize OpenAI client only when API key is available
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const prompt = `
You are a car search expert. Extract car search filters from the following natural language query.

Query: "${query}"

Return ONLY a valid JSON object with these possible fields (omit fields that don't apply):
{
  "budget": { "min": number, "max": number },
  "make": ["brand1", "brand2"],
  "bodyType": ["hatchback", "sedan", "suv", "estate", "convertible", "coupe"],
  "fuelType": ["petrol", "diesel", "hybrid", "electric"],
  "transmission": ["manual", "automatic"],
  "yearFrom": number,
  "yearTo": number,
  "mileageMax": number,
  "features": ["reliable", "fuel efficient", "sporty", "low insurance", "family friendly", "luxury", "performance"]
}

Guidelines:
- For "sporty", "two seat", "convertible", "coupe" queries, use bodyType: ["convertible", "coupe"]
- For "reliable" mentions, include "reliable" in features
- For "low running costs", "economical", "cheap to run", include "fuel efficient" in features
- For budget, extract amounts like "under £20k" → max: 20000
- For years, extract ranges like "2018-2020" or "newer than 2015"
- For mileage, extract limits like "under 50k miles" → mileageMax: 50000
- Popular reliable brands: toyota, honda, mazda, lexus
- Popular sporty brands: bmw, audi, porsche, mazda, ford (for performance models)

Return only the JSON object, no other text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a car search filter extraction expert. Always return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content?.trim();

    if (!response) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    const filters = JSON.parse(response) as CarFilters;

    console.log('OpenAI extracted filters:', filters);
    return filters;

  } catch (error) {
    console.error('OpenAI extraction error:', error);
    // Fall back to basic keyword matching if OpenAI fails
    return extractFiltersBasic(query);
  }
}

// Fallback function for basic keyword matching (original logic)
function extractFiltersBasic(query: string): CarFilters {
  const filters: CarFilters = {};
  const lowerQuery = query.toLowerCase();

  // Budget extraction
  const budgetMatches = query.match(/(?:under|below|less than|max|maximum|up to)\s*£?(\d+(?:,\d+)?(?:k)?)/i);
  if (budgetMatches) {
    let maxBudget = budgetMatches[1].replace(/,/g, '');
    if (maxBudget.includes('k')) {
      maxBudget = maxBudget.replace('k', '000');
    }
    filters.budget = { max: Number.parseInt(maxBudget) };
  }

  // Make extraction
  const makes = ['toyota', 'honda', 'ford', 'bmw', 'audi', 'mercedes', 'volkswagen', 'vauxhall', 'nissan', 'mazda', 'porsche', 'jaguar'];
  const foundMakes = makes.filter(make => lowerQuery.includes(make));
  if (foundMakes.length > 0) {
    filters.make = foundMakes;
  }

  // Body type extraction
  if (lowerQuery.includes('sporty') || lowerQuery.includes('sport') || lowerQuery.includes('two seat') || lowerQuery.includes('2 seat') || lowerQuery.includes('convertible') || lowerQuery.includes('coupe')) {
    filters.bodyType = ['convertible', 'coupe'];
  } else if (lowerQuery.includes('family') || lowerQuery.includes('estate') || lowerQuery.includes('suv')) {
    filters.bodyType = ['estate', 'suv'];
  } else if (lowerQuery.includes('small') || lowerQuery.includes('city') || lowerQuery.includes('hatchback')) {
    filters.bodyType = ['hatchback'];
  }

  // Features
  const features = [];
  if (lowerQuery.includes('reliable') || lowerQuery.includes('reliability')) {
    features.push('reliable');
  }
  if (lowerQuery.includes('fuel economy') || lowerQuery.includes('economical') || lowerQuery.includes('low running costs') || lowerQuery.includes('cheap to run')) {
    features.push('fuel efficient');
  }
  if (lowerQuery.includes('sporty') || lowerQuery.includes('fast') || lowerQuery.includes('performance')) {
    features.push('sporty');
  }
  if (features.length > 0) {
    filters.features = features;
  }

  return filters;
}

function createInterpretation(query: string, filters: CarFilters, resultCount: number): string {
  const parts = [];

  if (filters.bodyType?.includes('convertible') || filters.bodyType?.includes('coupe')) {
    parts.push('sporty cars');
  } else if (filters.bodyType?.includes('suv') || filters.bodyType?.includes('estate')) {
    parts.push('family cars');
  } else {
    parts.push('cars');
  }

  if (filters.features?.includes('reliable')) {
    parts.push('with excellent reliability');
  }

  if (filters.features?.includes('fuel efficient')) {
    parts.push('with low running costs');
  }

  if (filters.budget?.max) {
    parts.push(`under £${filters.budget.max.toLocaleString()}`);
  }

  if (filters.make?.length) {
    parts.push(`from ${filters.make.join(', ')}`);
  }

  const description = parts.join(' ');
  const aiNote = process.env.OPENAI_API_KEY ? ' (AI-powered search)' : ' (basic search)';

  return `Found ${resultCount} ${description} matching "${query}"${aiNote}`;
}

async function searchEbayListings(filters: CarFilters, postcode?: string, radius?: string): Promise<CarListing[]> {
  try {
    const scraper = getEbayScraper();

    // Convert our filters to eBay scraper format
    const searchFilters = {
      make: filters.make?.[0],
      maxPrice: filters.budget?.max,
      minYear: filters.yearFrom,
      maxYear: filters.yearTo,
      maxMileage: filters.mileageMax,
      fuelType: filters.fuelType?.[0],
      transmission: filters.transmission?.[0],
      postcode,
      radius: radius ? Number.parseInt(radius) : undefined,
      sortBy: 'date_desc' as const
    };

    const listings = await scraper.searchCars(searchFilters, 20);
    return listings;
  } catch (error) {
    console.error('eBay scraping error:', error);

    // Fallback to mock data if scraping fails
    const mockListings: CarListing[] = [
    {
      id: '1',
      title: '2018 Mazda MX-5 2.0 Sport Nav+ 2dr',
      price: 17995,
      year: 2018,
      mileage: 24000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      location: 'London',
      seller: 'Sports Car Specialists',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
      features: ['Reliable', 'Sporty', 'Fuel Efficient', 'Low Insurance', 'Convertible', 'Two Seats']
    },
    {
      id: '2',
      title: '2019 Toyota GT86 2.0 D-4S 2dr',
      price: 19500,
      year: 2019,
      mileage: 18000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      location: 'Birmingham',
      seller: 'Reliable Sports Cars',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
      features: ['Reliable', 'Sporty', 'Performance', 'Two Seats', 'Low Running Costs']
    },
    {
      id: '3',
      title: '2017 Audi TT 2.0 TFSI Sport Coupe 2dr',
      price: 22750,
      year: 2017,
      mileage: 31000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      location: 'Manchester',
      seller: 'Premium Coupes',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop',
      features: ['Sporty', 'Premium', 'Two Seats', 'Performance', 'Technology']
    },
    {
      id: '4',
      title: '2016 BMW Z4 2.0i sDrive28i M Sport 2dr',
      price: 18995,
      year: 2016,
      mileage: 35000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      location: 'Bristol',
      seller: 'Elite Motors',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop',
      features: ['Sporty', 'Convertible', 'Two Seats', 'Premium', 'Reliable']
    },
    {
      id: '5',
      title: '2020 Honda Civic 1.0 VTEC Turbo SR 5dr',
      price: 16500,
      year: 2020,
      mileage: 28000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      location: 'Birmingham',
      seller: 'Reliable Motors',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1627796744639-c7ea25411d47?w=400&h=250&fit=crop',
      features: ['Navigation', 'Cruise Control', 'Parking Sensors', 'Heated Seats']
    },
    {
      id: '6',
      title: '2019 Toyota Corolla 1.2T Design 5dr CVT',
      price: 14995,
      year: 2019,
      mileage: 32000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      location: 'London',
      seller: 'Premium Cars Ltd',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=250&fit=crop',
      features: ['Air Conditioning', 'Bluetooth', 'USB', 'Electric Windows']
    }
  ];

  // Filter listings based on criteria
  let filteredListings = mockListings;
  console.log('Starting with', filteredListings.length, 'cars');
  console.log('Filters to apply:', filters);

  if (filters.budget?.max) {
    filteredListings = filteredListings.filter(car => car.price <= filters.budget!.max!);
  }

  if (filters.transmission?.length) {
    filteredListings = filteredListings.filter(car =>
      filters.transmission!.some(trans =>
        car.transmission.toLowerCase().includes(trans.toLowerCase())
      )
    );
  }

  if (filters.bodyType?.length) {
    filteredListings = filteredListings.filter(car =>
      filters.bodyType!.some(bodyType => {
        const carTitle = car.title.toLowerCase();
        const carFeatures = car.features.map(f => f.toLowerCase()).join(' ');

        if (bodyType === 'convertible') {
          return carTitle.includes('convertible') || carFeatures.includes('convertible') || carTitle.includes('roadster') || carTitle.includes('z4') || carTitle.includes('mx-5');
        }
        if (bodyType === 'coupe') {
          return carTitle.includes('coupe') || carTitle.includes('gt86') || carTitle.includes('tt') || carFeatures.includes('two seats');
        }

        return carTitle.includes(bodyType) || carFeatures.includes(bodyType);
      })
    );
  }

  if (filters.features?.length) {
    // For multiple features, require cars to match MORE criteria (not just any one)
    filteredListings = filteredListings.filter(car => {
      const carFeatures = car.features.map(f => f.toLowerCase()).join(' ');
      const carTitle = car.title.toLowerCase();

      let matchCount = 0;

      for (const feature of filters.features!) {
        let matches = false;

        if (feature === 'reliable') {
          matches = carFeatures.includes('reliable') || carTitle.includes('toyota') || carTitle.includes('honda') || carTitle.includes('mazda');
        } else if (feature === 'fuel efficient') {
          matches = carFeatures.includes('fuel efficient') || carFeatures.includes('low running costs') || carTitle.includes('1.0') || carTitle.includes('1.2');
        } else if (feature === 'sporty') {
          matches = carFeatures.includes('sporty') || carFeatures.includes('performance') || carTitle.includes('sport') || carTitle.includes('gt') || carTitle.includes('tt') || carTitle.includes('mx-5');
        } else {
          matches = carFeatures.includes(feature);
        }

        if (matches) matchCount++;
      }

      // For complex queries, require at least 2 out of 3 features to match
      if (filters.features!.length >= 3) {
        return matchCount >= 2;
      }
      // For simpler queries, require at least 1 feature
      return matchCount >= 1;
    });
  }

  // For sporty two-seaters, prioritize cars that match both criteria
  if (filters.bodyType?.includes('convertible') || filters.bodyType?.includes('coupe')) {
    if (filters.features?.includes('sporty') || filters.features?.includes('reliable')) {
      // Sort sporty two-seaters to the top
      filteredListings.sort((a, b) => {
        const aIsSportyTwoSeater = a.features.some(f => ['Sporty', 'Two Seats', 'Convertible'].includes(f));
        const bIsSportyTwoSeater = b.features.some(f => ['Sporty', 'Two Seats', 'Convertible'].includes(f));

        if (aIsSportyTwoSeater && !bIsSportyTwoSeater) return -1;
        if (!aIsSportyTwoSeater && bIsSportyTwoSeater) return 1;
        return 0;
      });
    }
  }

  console.log('Final filtered results:', filteredListings.length, 'cars');
  console.log('Car titles:', filteredListings.map(car => car.title));

  return filteredListings;
  }
}

// --- Real Vehicle Search Functions ---

async function searchForRealVehicles(query: string, postcode?: string, radius?: string): Promise<CarListing[]> {
  try {
    // Use ChatGPT to extract search parameters from the query
    const filters = await extractFiltersFromQuery(query);

    console.log(`🔍 Real Vehicle Search: "${query}"`);
    console.log(`📋 Extracted filters:`, filters);

    // PRIORITY 1: Try real DVLA vehicle data first
    const realVehicleAPI = getRealVehicleAPI();
    const searchFilters = {
      make: filters.make?.[0],
      model: filters.model,
      maxPrice: filters.budget?.max,
      minYear: filters.yearFrom,
      maxYear: filters.yearTo,
      maxMileage: filters.mileageMax,
      fuelType: filters.fuelType?.[0],
      transmission: filters.transmission?.[0],
      postcode,
      radius: radius ? Number.parseInt(radius) : undefined
    };

    console.log('🚗 Attempting real DVLA vehicle lookup...');
    const realVehicles = await realVehicleAPI.searchRealVehicles(searchFilters, 15);

    if (realVehicles.length > 0) {
      console.log(`✅ Found ${realVehicles.length} real vehicles from DVLA data!`);
      return realVehicles;
    }

    // PRIORITY 2: Try multi-platform scrapers as backup
    console.log('⚠️ No real DVLA data found, trying multi-platform scrapers...');

    const multiScraper = getMultiPlatformScraper();
    const searchResults = await multiScraper.searchAllPlatforms(searchFilters, 10);

    if (searchResults.allListings.length > 0) {
      console.log(`🎉 Multi-platform results: ${searchResults.summary.totalListings} vehicles from ${searchResults.summary.platformsSearched} platforms`);
      // Mark these as "demo" data
      const demoListings = searchResults.allListings.map(listing => ({
        ...listing,
        source: listing.source || 'Demo Data'
      }));
      return demoListings.slice(0, 20);
    }

    // PRIORITY 3: Final fallback to realistic listings
    console.log('🎲 All real data sources failed, generating realistic fallback listings...');
    const fallbackListings = await generateRealisticListings(filters, query, postcode);

    // Mark as demo data
    return fallbackListings.map(listing => ({
      ...listing,
      source: 'Demo Data - Realistic Simulation'
    }));

  } catch (error) {
    console.error('Real vehicle search error:', error);
    // Fallback to realistic listings
    const filters = await extractFiltersFromQuery(query);
    const fallbackListings = await generateRealisticListings(filters, query, postcode);

    return fallbackListings.map(listing => ({
      ...listing,
      source: 'Demo Data - Error Fallback'
    }));
  }
}

async function generateRealisticListings(filters: CarFilters, originalQuery: string, postcode?: string): Promise<any[]> {
  // Generate realistic vehicle listings based on the extracted filters
  const makes = filters.make || ['Toyota', 'Honda', 'Ford', 'Volkswagen', 'BMW'];
  const budget = filters.budget?.max || 20000;
  const bodyTypes = filters.bodyType || ['Hatchback'];
  const features = filters.features || [];

  const realisticListings = [];
  const locations = ['London', 'Birmingham', 'Manchester', 'Bristol', 'Leeds', 'Liverpool', 'Sheffield', 'Newcastle'];

  for (let i = 0; i < Math.min(8, makes.length * 2); i++) {
    const make = makes[i % makes.length];
    const bodyType = bodyTypes[i % bodyTypes.length];
    const basePrice = budget * (0.6 + Math.random() * 0.4);
    const year = 2015 + Math.floor(Math.random() * 9);
    const mileage = Math.floor(20000 + Math.random() * 60000);

    // Generate realistic model names based on make
    const models = {
      Toyota: ['Corolla', 'Yaris', 'Auris', 'Prius', 'RAV4'],
      Honda: ['Civic', 'Jazz', 'CR-V', 'Accord', 'HR-V'],
      Ford: ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'EcoSport'],
      Volkswagen: ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc'],
      BMW: ['1 Series', '3 Series', 'X1', 'X3', 'i3']
    };

    const modelList = models[make as keyof typeof models] || ['Model'];
    const model = modelList[Math.floor(Math.random() * modelList.length)];

    realisticListings.push({
      id: `real_${i + 1}`,
      title: `${year} ${make} ${model} ${bodyType} ${mileage.toLocaleString()} miles`,
      price: Math.round(basePrice),
      year,
      mileage,
      fuelType: Math.random() > 0.3 ? 'Petrol' : 'Diesel',
      transmission: Math.random() > 0.4 ? 'Manual' : 'Automatic',
      location: postcode ? `Near ${postcode}` : locations[Math.floor(Math.random() * locations.length)],
      seller: `${make} Specialist Motors`,
      rating: 4.1 + Math.random() * 0.8,
      image: `https://images.unsplash.com/photo-${1494976388531 + i}-d1058494cdd8?w=400&h=250&fit=crop`,
      features: features.length > 0 ? features : ['Air Conditioning', 'Bluetooth', 'Alloy Wheels'],
      url: `https://www.ebay.co.uk/itm/mock-listing-${i}`,
      description: `Well maintained ${year} ${make} ${model} with ${mileage.toLocaleString()} miles`,
      bodyType,
      engineSize: '1.6L',
      doors: 5,
      condition: 'Used',
      listingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      source: 'Realistic Demo Listing'
    });
  }

  return realisticListings;
}

// --- ChatGPT Recommendation Functions ---

async function generateCarRecommendations(query: string): Promise<any[]> {
  // If OpenAI API key is not configured, fall back to basic recommendations
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using basic recommendations');
    return generateBasicRecommendations(query);
  }

  try {
    // Initialize OpenAI client only when API key is available
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are a UK car expert helping someone find the perfect used car. Based on their query, recommend 4-6 specific car models with realistic UK market details.

User Query: "${query}"

Return ONLY a valid JSON array of car recommendations. Each car should have this exact structure:
[
  {
    "id": "1",
    "title": "2018 Mazda MX-5 2.0 Sport Nav+ 2dr",
    "price": 17995,
    "year": 2018,
    "mileage": 24000,
    "fuelType": "Petrol",
    "transmission": "Manual",
    "location": "London",
    "seller": "Sports Car Specialists",
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop",
    "features": ["Reliable", "Sporty", "Fuel Efficient", "Two Seats", "Convertible"]
  }
]

Guidelines:
- Recommend cars that genuinely match their requirements
- Use realistic UK used car prices (£8k-£35k range)
- Include appropriate mileage for the year (10k-15k miles per year)
- Choose relevant features that match their needs
- Use generic UK locations (London, Birmingham, Manchester, Bristol, Leeds)
- Use realistic dealer names
- For sporty cars: recommend MX-5, GT86, TT, Z4, Mini Cooper S, Ford Focus ST
- For reliable cars: recommend Toyota, Honda, Mazda models
- For family cars: recommend SUVs, estates, practical hatchbacks
- For fuel efficient: recommend hybrid, small engines, economic models

Return only the JSON array, no other text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a UK car expert. Always return valid JSON array only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content?.trim();

    if (!response) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    const recommendations = JSON.parse(response);

    console.log('ChatGPT generated', recommendations.length, 'car recommendations');
    return recommendations;

  } catch (error) {
    console.error('ChatGPT recommendation error:', error);
    // Fall back to basic recommendations if ChatGPT fails
    return generateBasicRecommendations(query);
  }
}

function generateBasicRecommendations(query: string): any[] {
  // Fallback logic for when ChatGPT isn't available
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('sporty') || lowerQuery.includes('two seat') || lowerQuery.includes('convertible')) {
    return [
      {
        id: '1',
        title: '2018 Mazda MX-5 2.0 Sport Nav+ 2dr',
        price: 17995,
        year: 2018,
        mileage: 24000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        location: 'London',
        seller: 'Sports Car Specialists',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
        features: ['Reliable', 'Sporty', 'Fuel Efficient', 'Two Seats', 'Convertible']
      },
      {
        id: '2',
        title: '2019 Toyota GT86 2.0 D-4S 2dr',
        price: 19500,
        year: 2019,
        mileage: 18000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        location: 'Birmingham',
        seller: 'Reliable Sports Cars',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
        features: ['Reliable', 'Sporty', 'Performance', 'Two Seats']
      }
    ];
  }

  // Default recommendations for other queries
  return [
    {
      id: '1',
      title: '2019 Toyota Corolla 1.2T Design 5dr',
      price: 14995,
      year: 2019,
      mileage: 32000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      location: 'London',
      seller: 'Premium Cars Ltd',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=250&fit=crop',
      features: ['Reliable', 'Fuel Efficient', 'Family Friendly']
    }
  ];
}
