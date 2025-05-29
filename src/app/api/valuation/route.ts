import { NextResponse } from 'next/server';

interface ApiValuationResult {
  registration?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  currentValue: {
    retail: number;
    privateSale: number;
    tradeIn: number;
  };
  depreciationForecast?: {
    year1: number;
    year2: number;
    year3: number;
    year4?: number;
    year5?: number;
  };
  marketInsights?: {
    demand: 'Low' | 'Medium' | 'High' | string;
    supply: 'Low' | 'Medium' | 'High' | string;
    trend: 'Declining' | 'Stable' | 'Rising' | string;
    popularityScore?: number;
  };
  valuationFactors?: {
    ageImpact?: number;
    mileageImpact?: number;
    conditionImpact?: number;
    serviceHistoryImpact?: number;
  };
  comparableListings?: Array<{
    description: string;
    price: number;
    source?: string;
    location?: string;
    url?: string;
  }>;
}

const sampleValuation: ApiValuationResult = {
  make: "Honda",
  model: "Civic (Simulated)",
  year: 2020,
  mileage: 30000,
  currentValue: {
    retail: 17500,
    privateSale: 16000,
    tradeIn: 14500,
  },
  depreciationForecast: {
    year1: 13600, // Assuming current value is privateSale for depreciation base
    year2: 11520,
    year3: 9792,
    year4: 8323,
    year5: 7075,
  },
  marketInsights: {
    demand: 'High',
    supply: 'Medium',
    trend: 'Stable',
    popularityScore: 8.2,
  },
  valuationFactors: {
    ageImpact: 88, // Percentage representing positive impact (e.g. 100 = perfect for age)
    mileageImpact: 92, // Percentage representing positive impact (e.g. 100 = low mileage for age)
    conditionImpact: 85, // Assuming 'good'
    serviceHistoryImpact: 90, // Assuming 'full'
  },
  comparableListings: [
    { description: "2020 Honda Civic EX, 28k miles", price: 16200, source: "AutoSimulate", location: "Manchester" },
    { description: "2020 Honda Civic Sport, 32k miles", price: 15800, source: "CarZoneSim", location: "London" },
  ],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Create a deep copy to avoid modifying the original sampleValuation for subsequent requests
    let valuation = JSON.parse(JSON.stringify(sampleValuation));

    if (body.registration) {
      valuation.registration = body.registration.toUpperCase();
      valuation.make = "Ford (Simulated)"; // Simulate lookup by reg
      valuation.model = "Focus Zetec (Reg Lookup Sim)";
      valuation.year = 2019; // Simulate different year for reg
      valuation.mileage = 35000; // Simulate different mileage for reg
      valuation.currentValue.retail += 500; 
      valuation.currentValue.privateSale += 450;
      valuation.currentValue.tradeIn += 400;
    } else if (body.make && body.model) {
      valuation.make = body.make;
      valuation.model = `${body.model} (Manual Sim)`;
      valuation.year = body.year || sampleValuation.year;
      valuation.mileage = body.mileage || sampleValuation.mileage;
      // Slightly adjust price based on input make/model if different from default sample
      if (body.make.toLowerCase() !== sampleValuation.make.toLowerCase()) {
        valuation.currentValue.retail -= 300;
        valuation.currentValue.privateSale -= 250;
        valuation.currentValue.tradeIn -= 200;
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 900));

    return NextResponse.json(valuation);
  } catch (error) {
    console.error("Error in valuation API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to fetch valuation", details: errorMessage }, { status: 500 });
  }
}
