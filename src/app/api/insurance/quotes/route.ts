import { NextResponse } from 'next/server';

interface ApiInsuranceQuote {
  id: string;
  provider: string;
  logoUrl?: string;
  priceAnnual: number;
  priceMonthly: number;
  coverType: string; // e.g., "Comprehensive", "Third Party, Fire & Theft"
  rating?: number; // 0-5 stars
  reviewCount?: number;
  excessAmount: number;
  contactPhoneNumber?: string;
  websiteUrl?: string;
  features: {
    windscreenCover?: boolean;
    breakdownCover?: boolean;
    courtesyCar?: boolean;
    legalProtection?: boolean;
  };
  discountsAvailable?: string[];
  cashbackAmount?: number;
}

const sampleQuotes: ApiInsuranceQuote[] = [
  {
    id: "dl123",
    provider: "Direct Line Simulated",
    logoUrl: "https://logo.clearbit.com/directline.com",
    priceAnnual: 450.75,
    priceMonthly: 42.50,
    coverType: "Comprehensive",
    rating: 4.2,
    reviewCount: 18254,
    excessAmount: 250,
    contactPhoneNumber: "0345 246 0000",
    websiteUrl: "https://www.directline.com",
    features: {
      windscreenCover: true,
      breakdownCover: true,
      courtesyCar: true,
      legalProtection: false
    },
    discountsAvailable: ["Multi-car discount", "Online discount", "No Claims Bonus Protection"],
    cashbackAmount: 10
  },
  {
    id: "adm456",
    provider: "Admiral Simulated",
    logoUrl: "https://logo.clearbit.com/admiral.com",
    priceAnnual: 390.20,
    priceMonthly: 36.80,
    coverType: "Comprehensive",
    rating: 4.5,
    reviewCount: 24567,
    excessAmount: 200,
    contactPhoneNumber: "0333 220 1111",
    websiteUrl: "https://www.admiral.com",
    features: {
      windscreenCover: true,
      breakdownCover: false,
      courtesyCar: true,
      legalProtection: true
    },
    discountsAvailable: ["MultiCover", "Telematics discount", "Named Driver Discount"],
    cashbackAmount: 25
  },
  {
    id: "avv789",
    provider: "Aviva Simulated",
    logoUrl: "https://logo.clearbit.com/aviva.com",
    priceAnnual: 420.00,
    priceMonthly: 39.99,
    coverType: "Comprehensive",
    rating: 4.3,
    reviewCount: 21032,
    excessAmount: 300,
    contactPhoneNumber: "0800 092 3615",
    websiteUrl: "https://www.aviva.co.uk",
    features: {
      windscreenCover: true,
      breakdownCover: true,
      courtesyCar: true,
      legalProtection: true
    },
    discountsAvailable: ["AvivaPlus discount", "Multi-car discount", "Low Mileage Discount"],
    cashbackAmount: 0 // No cashback for this example
  },
  {
    id: "hast012",
    provider: "Hastings Direct Simulated",
    logoUrl: "https://logo.clearbit.com/hastingsdirect.com",
    priceAnnual: 375.50,
    priceMonthly: 35.00,
    coverType: "Third Party, Fire & Theft",
    rating: 4.0,
    reviewCount: 15300,
    excessAmount: 350,
    contactPhoneNumber: "0333 321 9800",
    websiteUrl: "https://www.hastingsdirect.com",
    features: {
      windscreenCover: false, // Typically not on TPFT
      breakdownCover: false,
      courtesyCar: false,
      legalProtection: true
    },
    discountsAvailable: ["Online purchase discount", "Named driver experience"],
    cashbackAmount: 5
  }
];

export async function POST(request: Request) {
  try {
    // const requestData = await request.json();
    // console.log("Received insurance quote request (simulated):", requestData);
    
    // In a real API, you'd use requestData (driver, vehicle, coverage details)
    // to interact with actual insurance provider APIs or a rate aggregator.
    // For this simulation, we'll just return our fixed list of sample quotes.

    // Simulate some processing delay as fetching quotes can take time
    await new Promise(resolve => setTimeout(resolve, 1200)); 

    return NextResponse.json(sampleQuotes);
  } catch (error) {
    console.error("Error in insurance quotes API:", error);
    // Check if the error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to fetch insurance quotes", details: errorMessage }, { status: 500 });
  }
}
