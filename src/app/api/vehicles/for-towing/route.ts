import { NextResponse } from 'next/server';

interface ApiTowingVehicle {
  id: string;
  make: string;
  model: string;
  year: string; // Or number
  towingCapacity: number;
  priceRange: string; // e.g., "£35,000 - £45,000"
  fuelType?: string;
  bodyType?: string;
  engineDetails?: string;
  imageUrl?: string;
  pros?: string[];
  cons?: string[];
  suitability?: 'excellent' | 'good' | 'fair' | string; // For towing
}

const allSampleTowingVehicles: ApiTowingVehicle[] = [
  {
    id: "ford-ranger-wildtrak-sim",
    make: "Ford",
    model: "Ranger Wildtrak (Simulated)",
    year: "2023",
    towingCapacity: 3500,
    priceRange: "£35,000 - £45,000", // Matches 30k-50k, 35k-45k
    fuelType: "Diesel",
    bodyType: "Pick-up Truck",
    engineDetails: "2.0L Bi-Turbo Diesel",
    imageUrl: "https://images.unsplash.com/photo-1605767832041-bcfde34871d2?w=400&h=250&fit=crop&auto=format",
    pros: ["Excellent towing capacity", "Robust build", "Off-road capable"],
    cons: ["Large for city use", "Can be thirsty"],
    suitability: "excellent"
  },
  {
    id: "lr-discovery-sim",
    make: "Land Rover",
    model: "Discovery HSE (Simulated)",
    year: "2023",
    towingCapacity: 3500,
    priceRange: "£55,000 - £70,000", // Matches 50k-70k, over-50k
    fuelType: "Diesel",
    bodyType: "SUV",
    engineDetails: "3.0L D300 Diesel",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop&auto=format", // Different image
    pros: ["Luxury interior", "Advanced towing tech", "Superb comfort"],
    cons: ["High price point", "Potential reliability concerns"],
    suitability: "excellent"
  },
  {
    id: "kia-sorento-phev-sim",
    make: "Kia",
    model: "Sorento PHEV (Simulated)",
    year: "2024",
    towingCapacity: 1500, // Lower for PHEV
    priceRange: "£45,000 - £55,000", // Matches 30k-50k, 40k-60k
    fuelType: "Hybrid",
    bodyType: "SUV",
    engineDetails: "1.6L T-GDi PHEV",
    imageUrl: "https://images.unsplash.com/photo-1617083278319-3ff21418000c?w=400&h=250&fit=crop&auto=format",
    pros: ["Fuel efficient for daily driving", "7 seats", "Good warranty"],
    cons: ["Limited towing for heavy loads", "PHEV range can vary"],
    suitability: "fair"
  },
  {
    id: "vw-touareg-sim",
    make: "Volkswagen",
    model: "Touareg R-Line (Simulated)",
    year: "2022",
    towingCapacity: 3500,
    priceRange: "£50,000 - £65,000", // Matches 50k-70k, over-50k
    fuelType: "Diesel",
    bodyType: "SUV",
    engineDetails: "3.0L V6 TDI",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=250&fit=crop&auto=format",
    pros: ["Strong engine performance", "High-quality cabin", "Comfortable cruiser"],
    cons: ["Can get expensive with options", "Not as agile as some rivals"],
    suitability: "excellent"
  },
  {
    id: "skoda-kodiaq-sim",
    make: "Skoda",
    model: "Kodiaq Sportline 4x4 (Simulated)",
    year: "2023",
    towingCapacity: 2000,
    priceRange: "£30,000 - £40,000", // Matches 30k-50k, under-40k
    fuelType: "Petrol",
    bodyType: "SUV",
    engineDetails: "2.0L TSI 190PS",
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop&auto=format",
    pros: ["Practical and spacious", "Good value for money", "Available 4x4"],
    cons: ["DSG can be hesitant at low speeds", "Some rivals have higher towing capacity"],
    suitability: "good"
  }
];

// Helper to parse budget string e.g., "30k-50k" to [30000, 50000]
const parseBudget = (budgetStr: string | null): [number, number] | null => {
  if (!budgetStr) return null;
  if (budgetStr.startsWith("under-")) {
    const value = parseInt(budgetStr.replace("under-", "").replace("k", ""));
    return [0, value * 1000];
  }
  if (budgetStr.startsWith("over-")) {
    const value = parseInt(budgetStr.replace("over-", "").replace("k", ""));
    return [value * 1000, Infinity];
  }
  const parts = budgetStr.split('-');
  if (parts.length === 2) {
    return [
      parseInt(parts[0].replace("k", "")) * 1000,
      parseInt(parts[1].replace("k", "")) * 1000
    ];
  }
  return null;
};

// Helper to check if vehicle price range overlaps with budget range
const checkPriceOverlap = (vehiclePriceRange: string, budgetRange: [number, number] | null): boolean => {
  if (!budgetRange) return true; // No budget filter applied

  const priceStr = vehiclePriceRange.replace(/[£,K\s]/gi, ''); // Remove £, K, k and whitespace
  const prices = priceStr.split('-').map(p => parseInt(p)); 
  
  // Handle cases like "£35000" which won't split by '-'
  let minVehiclePrice = 0;
  let maxVehiclePrice = Infinity;

  if (prices.length === 1) { // e.g. "35000"
      minVehiclePrice = prices[0];
      maxVehiclePrice = prices[0];
  } else if (prices.length === 2) { // e.g. "35000-45000"
      minVehiclePrice = prices[0];
      maxVehiclePrice = prices[1];
  } else {
      return false; // Invalid vehicle price range format
  }
  
  // Ensure min and max are correctly ordered if only one is parsed (e.g. from "over-50000")
  if (maxVehiclePrice < minVehiclePrice) maxVehiclePrice = minVehiclePrice;


  return !(budgetRange[1] < minVehiclePrice || budgetRange[0] > maxVehiclePrice);
};


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minTowingCapacityQuery = searchParams.get('minTowingCapacity');
  const fuelTypeQuery = searchParams.get('fuelType');
  const budgetQuery = searchParams.get('budget'); // e.g. "30k-50k", "under-30k", "over-60k"

  let vehicles = allSampleTowingVehicles;

  if (minTowingCapacityQuery) {
    const minCap = parseInt(minTowingCapacityQuery);
    if (!isNaN(minCap)) {
      vehicles = vehicles.filter(v => v.towingCapacity >= minCap);
    }
  }

  if (fuelTypeQuery && fuelTypeQuery.toLowerCase() !== "any" && fuelTypeQuery.toLowerCase() !== "any fuel type") {
    vehicles = vehicles.filter(v => v.fuelType?.toLowerCase() === fuelTypeQuery.toLowerCase());
  }
  
  const budgetRange = parseBudget(budgetQuery);
  if (budgetRange) {
    vehicles = vehicles.filter(v => checkPriceOverlap(v.priceRange, budgetRange));
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(vehicles);
}
