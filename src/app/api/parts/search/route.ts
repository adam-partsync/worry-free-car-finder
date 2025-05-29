import { NextResponse } from 'next/server';

interface ApiPartResult {
  id: string;
  name: string;
  partNumber: string;
  brand: string;
  price: number;
  originalPrice?: number;
  supplierName: string;
  supplierRating?: number;
  supplierReviewCount?: number;
  isInStock: boolean;
  stockLevelDescription?: 'high' | 'medium' | 'low' | string;
  deliveryInfo: {
    timeText: string;
    costAmount: number;
    availableOptions?: string[];
  };
  warrantyInformation: string;
  qualityDescription: 'OEM' | 'OE' | 'Aftermarket' | 'Pattern' | string;
  compatibilityNotes?: string[];
  imageUrls: string[];
  featureList?: string[];
  supplierDetails?: {
    locationName?: string;
    phoneNumber?: string;
    websiteUrl?: string;
    emailAddress?: string;
    businessHoursInfo?: string;
    returnPolicyInfo?: string;
  };
}

const allSampleParts: ApiPartResult[] = [
  {
    id: "bosch-bp-001",
    name: "Front Brake Pads Set - Simulated",
    partNumber: "BP-T-COR-001-SIM",
    brand: "Bosch",
    price: 42.99,
    originalPrice: 50.00,
    supplierName: "Simulated Auto Parts",
    supplierRating: 4.6,
    supplierReviewCount: 12000,
    isInStock: true,
    stockLevelDescription: 'high',
    deliveryInfo: {
      timeText: "Next Day",
      costAmount: 0,
      availableOptions: ["Next Day (Free)", "Same Day (£5.99)"]
    },
    warrantyInformation: "2 Years",
    qualityDescription: "OE",
    compatibilityNotes: ["Toyota Corolla 2018-2024 Simulated", "Suzuki Swace 2020-2024"],
    imageUrls: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&auto=format&fit=crop"],
    featureList: ["Low dust formula", "ECE R90 approved (Simulated)", "Includes wear indicators"],
    supplierDetails: {
      locationName: "Testville, UK",
      phoneNumber: "01234 987654",
      websiteUrl: "simulatedparts.com",
      emailAddress: "sales@simulatedparts.com",
      businessHoursInfo: "Mon-Fri 8am-6pm, Sat 9am-1pm",
      returnPolicyInfo: "30 days return, buyer pays postage"
    }
  },
  {
    id: "mann-of-002",
    name: "Oil Filter - Simulated",
    partNumber: "OF-VW-GOLF-002-SIM",
    brand: "Mann-Filter",
    price: 12.50,
    supplierName: "Parts Express Simulated",
    supplierRating: 4.8,
    supplierReviewCount: 8500,
    isInStock: true,
    stockLevelDescription: 'medium',
    deliveryInfo: {
      timeText: "1-2 Working Days",
      costAmount: 2.99,
      availableOptions: ["Standard (1-2 days, £2.99)", "Express Next Day (£4.99)"]
    },
    warrantyInformation: "1 Year or 12,000 miles",
    qualityDescription: "OEM",
    compatibilityNotes: ["VW Golf Mk7 1.4 TSI Simulated", "Audi A3 8V 1.4 TFSI Simulated"],
    imageUrls: ["https://images.unsplash.com/photo-1620527947047-700f8b0197a1?w=400&auto=format&fit=crop"],
    featureList: ["High filtration efficiency", "Long service life", "Includes O-ring"],
    supplierDetails: {
      locationName: "Online Only",
      websiteUrl: "partsexpress-sim.co.uk",
      returnPolicyInfo: "60 days free returns"
    }
  },
  {
    id: "ngk-sp-003",
    name: "Spark Plugs (Set of 4) - Simulated",
    partNumber: "SP-FD-FCS-003-SIM",
    brand: "NGK",
    price: 28.75,
    originalPrice: 35.00,
    supplierName: "Simulated Auto Parts", // Same supplier as first part
    supplierRating: 4.6, // Consistent rating
    supplierReviewCount: 12000, // Consistent review count
    isInStock: false,
    stockLevelDescription: 'Awaiting stock - 3-5 days',
    deliveryInfo: {
      timeText: "3-5 Working Days (once in stock)",
      costAmount: 3.50
    },
    warrantyInformation: "1 Year",
    qualityDescription: "OE",
    compatibilityNotes: ["Ford Focus Mk3 1.0 EcoBoost Simulated"],
    imageUrls: ["https://images.unsplash.com/photo-1619009419030-359630908d0c?w=400&auto=format&fit=crop"],
    featureList: ["Laser Iridium", "Pre-gapped", "Improved fuel efficiency"],
    supplierDetails: { // Consistent details for this supplier
      locationName: "Testville, UK",
      phoneNumber: "01234 987654",
      websiteUrl: "simulatedparts.com",
      emailAddress: "sales@simulatedparts.com",
      businessHoursInfo: "Mon-Fri 8am-6pm, Sat 9am-1pm",
      returnPolicyInfo: "30 days return, buyer pays postage"
    }
  },
  {
    id: "febi-wb-004",
    name: "Front Wheel Bearing Kit - Simulated",
    partNumber: "WB-RN-CLIO-004-SIM",
    brand: "Febi Bilstein",
    price: 35.99,
    supplierName: "Euro Car Parts (Simulated)",
    supplierRating: 4.3,
    supplierReviewCount: 25000,
    isInStock: true,
    stockLevelDescription: "low",
    deliveryInfo: {
        timeText: "Next Day if ordered by 4pm",
        costAmount: 4.99,
        availableOptions: ["Next Day (£4.99)", "Click & Collect (Free)"]
    },
    warrantyInformation: "3 Years",
    qualityDescription: "Aftermarket",
    compatibilityNotes: ["Renault Clio Mk4 (2012-2019) Simulated"],
    imageUrls: ["https://images.unsplash.com/photo-1581809189824-719395076f16?w=400&auto=format&fit=crop"],
    featureList: ["Includes all necessary fittings", "Precision engineered", "TÜV Certified quality (Simulated)"],
    supplierDetails: {
        websiteUrl: "eurocarparts-sim.com",
        returnPolicyInfo: "90 days returns, conditions apply"
    }
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const partNameQuery = searchParams.get('partName');
  // const makeQuery = searchParams.get('make'); // Example for future use
  // const modelQuery = searchParams.get('model'); // Example for future use

  let partsToReturn = allSampleParts;

  if (partNameQuery) {
    const lowerCaseQuery = partNameQuery.toLowerCase();
    partsToReturn = allSampleParts.filter(part =>
      part.name.toLowerCase().includes(lowerCaseQuery) ||
      part.brand.toLowerCase().includes(lowerCaseQuery)
    );
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));

  return NextResponse.json(partsToReturn);
}
