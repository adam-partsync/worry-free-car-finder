import { type NextRequest, NextResponse } from 'next/server';
import { getEbayScraper, type CarListing } from '@/lib/scrapers/ebay-scraper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface AdvancedSearchFilters {
  make: string;
  model: string;
  priceMin: number;
  priceMax: number;
  yearMin: number;
  yearMax: number;
  mileageMax: number;
  fuelTypes: string[];
  transmissions: string[];
  bodyTypes: string[];
  doors: string[];
  engineSizeMin: number;
  engineSizeMax: number;
  features: string[];
  postcode: string;
  searchRadius: number;
  sellerTypes: string[];
  conditions: string[];
  maxPreviousOwners: number;
  minServiceHistory: boolean;
  sortBy: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const filters: AdvancedSearchFilters = await request.json();

    // Validate required fields
    if (filters.priceMax < filters.priceMin) {
      return NextResponse.json(
        { error: 'Maximum price must be greater than minimum price' },
        { status: 400 }
      );
    }

    if (filters.yearMax < filters.yearMin) {
      return NextResponse.json(
        { error: 'Maximum year must be greater than minimum year' },
        { status: 400 }
      );
    }

    // Search multiple sources
    const searchPromises = [
      searchEbayWithFilters(filters),
      // Add more sources here:
      // searchAutoTraderWithFilters(filters),
      // searchGumtreeWithFilters(filters),
    ];

    const searchResults = await Promise.allSettled(searchPromises);

    // Combine results from all sources
    let allResults: CarListing[] = [];

    searchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allResults = [...allResults, ...result.value];
      } else {
        console.error(`Search source ${index} failed:`, result.reason);
      }
    });

    // Apply additional filtering that couldn't be done at source level
    const filteredResults = applyAdvancedFilters(allResults, filters);

    // Sort results
    const sortedResults = sortResults(filteredResults, filters.sortBy);

    // Save search to database if user is logged in
    if (session?.user) {
      try {
        await db.search.create({
          data: {
            userId: session.user.id,
            query: generateSearchQuery(filters),
            filters: filters as any,
            results: sortedResults as any
          }
        });
      } catch (dbError) {
        console.error('Failed to save search to database:', dbError);
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json({
      success: true,
      results: sortedResults,
      totalResults: sortedResults.length,
      searchMeta: {
        appliedFilters: filters,
        sourcesSearched: searchResults.length,
        successfulSources: searchResults.filter(r => r.status === 'fulfilled').length
      }
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform advanced search' },
      { status: 500 }
    );
  }
}

async function searchEbayWithFilters(filters: AdvancedSearchFilters): Promise<CarListing[]> {
  try {
    const scraper = getEbayScraper();

    // Convert advanced filters to eBay scraper format
    const ebayFilters = {
      make: filters.make || undefined,
      model: filters.model || undefined,
      minPrice: filters.priceMin > 0 ? filters.priceMin : undefined,
      maxPrice: filters.priceMax < 50000 ? filters.priceMax : undefined,
      minYear: filters.yearMin > 2000 ? filters.yearMin : undefined,
      maxYear: filters.yearMax < 2025 ? filters.yearMax : undefined,
      maxMileage: filters.mileageMax < 200000 ? filters.mileageMax : undefined,
      fuelType: filters.fuelTypes.length === 1 ? filters.fuelTypes[0] : undefined,
      transmission: filters.transmissions.length === 1 ? filters.transmissions[0] : undefined,
      postcode: filters.postcode || undefined,
      radius: filters.searchRadius > 0 ? filters.searchRadius : undefined,
      sortBy: mapSortBy(filters.sortBy)
    };

    const results = await scraper.searchCars(ebayFilters, 100);
    return results;
  } catch (error) {
    console.error('eBay search error:', error);
    return [];
  }
}

function applyAdvancedFilters(results: CarListing[], filters: AdvancedSearchFilters): CarListing[] {
  return results.filter(car => {
    // Body type filter
    if (filters.bodyTypes.length > 0 && car.bodyType) {
      if (!filters.bodyTypes.some(type =>
        car.bodyType?.toLowerCase().includes(type.toLowerCase())
      )) {
        return false;
      }
    }

    // Fuel type filter
    if (filters.fuelTypes.length > 0 && car.fuelType) {
      if (!filters.fuelTypes.some(type =>
        car.fuelType?.toLowerCase().includes(type.toLowerCase())
      )) {
        return false;
      }
    }

    // Transmission filter
    if (filters.transmissions.length > 0 && car.transmission) {
      if (!filters.transmissions.some(trans =>
        car.transmission?.toLowerCase().includes(trans.toLowerCase())
      )) {
        return false;
      }
    }

    // Doors filter
    if (filters.doors.length > 0 && car.doors) {
      if (!filters.doors.includes(car.doors.toString())) {
        return false;
      }
    }

    // Engine size filter
    if (car.engineSize && filters.engineSizeMin > 0) {
      const engineSize = Number.parseFloat(car.engineSize.replace(/[^\d.]/g, ''));
      if (engineSize < filters.engineSizeMin || engineSize > filters.engineSizeMax) {
        return false;
      }
    }

    // Features filter
    if (filters.features.length > 0) {
      const carFeatures = car.features.map(f => f.toLowerCase());
      const requiredFeatures = filters.features.map(f => f.toLowerCase());

      // Check if car has at least some of the required features
      const hasRequiredFeatures = requiredFeatures.some(feature =>
        carFeatures.some(carFeature => carFeature.includes(feature))
      );

      if (!hasRequiredFeatures) {
        return false;
      }
    }

    // Seller type filter
    if (filters.sellerTypes.length > 0) {
      if (!filters.sellerTypes.some(type =>
        car.seller.type.toLowerCase() === type.toLowerCase()
      )) {
        return false;
      }
    }

    // Condition filter
    if (filters.conditions.length > 0 && car.condition) {
      if (!filters.conditions.some(condition =>
        car.condition?.toLowerCase().includes(condition.toLowerCase())
      )) {
        return false;
      }
    }

    return true;
  });
}

function sortResults(results: CarListing[], sortBy: string): CarListing[] {
  return [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'year_desc':
        return (b.year || 0) - (a.year || 0);
      case 'year_asc':
        return (a.year || 0) - (b.year || 0);
      case 'mileage_asc':
        return (a.mileage || 0) - (b.mileage || 0);
      case 'mileage_desc':
        return (b.mileage || 0) - (a.mileage || 0);
      case 'date_desc':
      default:
        return new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime();
    }
  });
}

function mapSortBy(sortBy: string): 'price_asc' | 'price_desc' | 'date_desc' | 'mileage_asc' {
  switch (sortBy) {
    case 'price_asc':
      return 'price_asc';
    case 'price_desc':
      return 'price_desc';
    case 'mileage_asc':
      return 'mileage_asc';
    case 'date_desc':
    default:
      return 'date_desc';
  }
}

function generateSearchQuery(filters: AdvancedSearchFilters): string {
  const parts: string[] = [];

  if (filters.make) parts.push(filters.make);
  if (filters.model) parts.push(filters.model);
  if (filters.fuelTypes.length > 0) parts.push(filters.fuelTypes.join(' or '));
  if (filters.bodyTypes.length > 0) parts.push(filters.bodyTypes.join(' or '));

  const priceRange = `£${filters.priceMin.toLocaleString()}-£${filters.priceMax.toLocaleString()}`;
  parts.push(priceRange);

  return parts.join(' ') || 'Advanced Search';
}
