import { type NextRequest, NextResponse } from 'next/server';

interface PriceAnalysisRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition?: string;
  bodyType?: string;
  engineSize?: string;
  postcode?: string;
}

interface MarketData {
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
    q1: number;
    q3: number;
  };
  marketTrend: 'rising' | 'falling' | 'stable';
  trendPercentage: number;
  demandLevel: 'low' | 'medium' | 'high';
  supply: {
    available: number;
    averageDaysOnMarket: number;
  };
  depreciation: {
    nextYear: number;
    threeYear: number;
    fiveYear: number;
  };
  factors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
    priceImpact: number;
  }>;
  recommendations: {
    fairPrice: number;
    goodDeal: number;
    excellentDeal: number;
    negotiationTips: string[];
    timing: {
      bestMonthToBuy: string;
      worstMonthToBuy: string;
      reasoning: string;
    };
  };
  comparisons: Array<{
    make: string;
    model: string;
    averagePrice: number;
    pros: string[];
    cons: string[];
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const vehicleData: PriceAnalysisRequest = await request.json();

    // Validate required fields
    if (!vehicleData.make || !vehicleData.model || !vehicleData.year || !vehicleData.mileage) {
      return NextResponse.json(
        { error: 'Make, model, year, and mileage are required' },
        { status: 400 }
      );
    }

    // Generate market analysis
    const marketData = await generateMarketAnalysis(vehicleData);

    return NextResponse.json({
      success: true,
      vehicle: vehicleData,
      marketData,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Price analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze market data' },
      { status: 500 }
    );
  }
}

async function generateMarketAnalysis(vehicle: PriceAnalysisRequest): Promise<MarketData> {
  // In production, this would aggregate data from multiple sources:
  // - AutoTrader API
  // - eBay Motors
  // - Glass's Guide
  // - CAP HPI
  // - Local dealership data

  // For demo, we'll generate realistic market data based on vehicle characteristics

  const basePrice = calculateBasePrice(vehicle);
  const adjustments = calculateAdjustments(vehicle);
  const finalPrice = Math.round(basePrice * adjustments.multiplier);

  // Generate price range (±20% typically)
  const priceRange = {
    min: Math.round(finalPrice * 0.8),
    max: Math.round(finalPrice * 1.2),
    q1: Math.round(finalPrice * 0.9),
    q3: Math.round(finalPrice * 1.1),
  };

  // Determine market trend
  const trendFactors = calculateMarketTrend(vehicle);

  // Calculate depreciation
  const depreciation = calculateDepreciation(vehicle);

  // Generate factors affecting price
  const factors = generatePriceFactors(vehicle, adjustments);

  // Generate recommendations
  const recommendations = generateRecommendations(finalPrice, vehicle);

  // Generate comparisons
  const comparisons = generateComparisons(vehicle, finalPrice);

  return {
    averagePrice: finalPrice,
    priceRange,
    marketTrend: trendFactors.trend,
    trendPercentage: trendFactors.percentage,
    demandLevel: calculateDemandLevel(vehicle),
    supply: {
      available: Math.floor(Math.random() * 50) + 10,
      averageDaysOnMarket: Math.floor(Math.random() * 60) + 20,
    },
    depreciation,
    factors,
    recommendations,
    comparisons,
  };
}

function calculateBasePrice(vehicle: PriceAnalysisRequest): number {
  // Base pricing algorithm considering make, model, year
  const currentYear = new Date().getFullYear();
  const age = currentYear - vehicle.year;

  // Starting prices by make (rough estimates)
  const makePrices: Record<string, number> = {
    'toyota': 25000,
    'honda': 24000,
    'ford': 20000,
    'vauxhall': 18000,
    'volkswagen': 26000,
    'bmw': 35000,
    'audi': 33000,
    'mercedes': 40000,
    'nissan': 19000,
    'hyundai': 17000,
    'kia': 16000,
    'mazda': 22000,
    'peugeot': 17000,
    'renault': 16000,
    'skoda': 20000,
    'seat': 19000,
  };

  const basePrice = makePrices[vehicle.make.toLowerCase()] || 20000;

  // Depreciation curve (steeper in first few years)
  let depreciatedPrice = basePrice;
  for (let i = 0; i < age; i++) {
    const depreciationRate = i < 3 ? 0.15 : 0.08; // 15% first 3 years, 8% thereafter
    depreciatedPrice *= (1 - depreciationRate);
  }

  // Mileage adjustment (average 12,000 miles/year)
  const expectedMileage = age * 12000;
  const mileageDiff = vehicle.mileage - expectedMileage;
  const mileageAdjustment = mileageDiff * -0.1; // -£0.10 per excess mile

  return Math.max(1000, depreciatedPrice + mileageAdjustment);
}

function calculateAdjustments(vehicle: PriceAnalysisRequest) {
  let multiplier = 1.0;
  const factors: string[] = [];

  // Fuel type adjustments
  switch (vehicle.fuelType.toLowerCase()) {
    case 'electric':
      multiplier *= 1.15;
      factors.push('Electric vehicles command premium');
      break;
    case 'hybrid':
      multiplier *= 1.08;
      factors.push('Hybrid technology adds value');
      break;
    case 'diesel':
      multiplier *= 0.95;
      factors.push('Diesel uncertainty affects values');
      break;
  }

  // Transmission adjustments
  if (vehicle.transmission.toLowerCase() === 'automatic') {
    multiplier *= 1.05;
    factors.push('Automatic transmission preferred');
  }

  // Condition adjustments
  switch (vehicle.condition?.toLowerCase()) {
    case 'excellent':
      multiplier *= 1.1;
      break;
    case 'poor':
      multiplier *= 0.8;
      break;
  }

  return { multiplier, factors };
}

function calculateMarketTrend(vehicle: PriceAnalysisRequest) {
  // Simulate market trends based on vehicle characteristics
  const trends = ['rising', 'falling', 'stable'] as const;
  const trend = trends[Math.floor(Math.random() * trends.length)];

  let percentage: number;
  switch (trend) {
    case 'rising':
      percentage = Math.random() * 8 + 2; // 2-10%
      break;
    case 'falling':
      percentage = -(Math.random() * 6 + 1); // -1% to -7%
      break;
    default:
      percentage = (Math.random() - 0.5) * 4; // -2% to +2%
  }

  return { trend, percentage: Math.round(percentage * 10) / 10 };
}

function calculateDepreciation(vehicle: PriceAnalysisRequest) {
  const age = new Date().getFullYear() - vehicle.year;

  // Depreciation typically slows with age
  const nextYear = age < 3 ? 12 : age < 7 ? 8 : 5;
  const threeYear = age < 2 ? 35 : age < 5 ? 25 : 18;
  const fiveYear = age === 0 ? 55 : age < 3 ? 45 : 35;

  return {
    nextYear,
    threeYear,
    fiveYear,
  };
}

function calculateDemandLevel(vehicle: PriceAnalysisRequest): 'low' | 'medium' | 'high' {
  const popularMakes = ['toyota', 'honda', 'volkswagen', 'bmw', 'audi'];
  const isPopularMake = popularMakes.includes(vehicle.make.toLowerCase());
  const isRecentModel = (new Date().getFullYear() - vehicle.year) < 5;
  const isLowMileage = vehicle.mileage < 60000;

  if (isPopularMake && isRecentModel && isLowMileage) return 'high';
  if (isPopularMake || (isRecentModel && isLowMileage)) return 'medium';
  return 'low';
}

function generatePriceFactors(vehicle: PriceAnalysisRequest, adjustments: any) {
  const factors = [
    {
      factor: 'Vehicle Age',
      impact: (new Date().getFullYear() - vehicle.year) < 5 ? 'positive' : 'negative' as const,
      description: `${new Date().getFullYear() - vehicle.year} years old`,
      priceImpact: (new Date().getFullYear() - vehicle.year) < 5 ? 500 : -800,
    },
    {
      factor: 'Mileage',
      impact: vehicle.mileage < 50000 ? 'positive' : vehicle.mileage > 100000 ? 'negative' : 'neutral' as const,
      description: `${vehicle.mileage.toLocaleString()} miles`,
      priceImpact: vehicle.mileage < 50000 ? 800 : vehicle.mileage > 100000 ? -1200 : 0,
    },
    {
      factor: 'Fuel Type',
      impact: vehicle.fuelType.toLowerCase() === 'electric' ? 'positive' : 'neutral' as const,
      description: `${vehicle.fuelType} engine`,
      priceImpact: vehicle.fuelType.toLowerCase() === 'electric' ? 2000 : 0,
    },
    {
      factor: 'Market Demand',
      impact: 'positive' as const,
      description: 'Popular model with good resale value',
      priceImpact: 600,
    },
  ];

  return factors;
}

function generateRecommendations(averagePrice: number, vehicle: PriceAnalysisRequest) {
  return {
    fairPrice: Math.round(averagePrice),
    goodDeal: Math.round(averagePrice * 0.92),
    excellentDeal: Math.round(averagePrice * 0.85),
    negotiationTips: [
      'Research similar vehicles in your area for comparison',
      'Check the vehicle history and MOT records thoroughly',
      'Inspect for any cosmetic or mechanical issues to justify lower price',
      'Consider the total cost of ownership, not just purchase price',
      'Be prepared to walk away if the price isn\'t right',
    ],
    timing: {
      bestMonthToBuy: 'September',
      worstMonthToBuy: 'March',
      reasoning: 'Dealers often have better deals in September due to new plate releases, while March sees highest demand.',
    },
  };
}

function generateComparisons(vehicle: PriceAnalysisRequest, price: number) {
  const alternatives = [
    {
      make: 'Honda',
      model: 'Civic',
      averagePrice: price * 0.95,
      pros: ['Excellent reliability', 'Low running costs', 'Good resale value'],
      cons: ['Less premium feel', 'Smaller boot space'],
    },
    {
      make: 'Volkswagen',
      model: 'Golf',
      averagePrice: price * 1.08,
      pros: ['Premium interior', 'Excellent build quality', 'Strong performance'],
      cons: ['Higher maintenance costs', 'More expensive parts'],
    },
    {
      make: 'Ford',
      model: 'Focus',
      averagePrice: price * 0.88,
      pros: ['Lower purchase price', 'Good driving dynamics', 'Wide dealer network'],
      cons: ['Faster depreciation', 'Interior quality varies'],
    },
  ];

  return alternatives.map(alt => ({
    ...alt,
    averagePrice: Math.round(alt.averagePrice),
  }));
}
