import { NextResponse } from 'next/server';

interface ApiVehicle {
  id: string; // Unique identifier for the vehicle
  make: string;
  model: string;
  variant?: string;
  year: number;
  price: {
    amount: number;
    currency: string;
  };
  imageUrl?: string;
  specifications: {
    engine?: string; // e.g., "2.0L Turbocharged I4"
    horsepower?: number;
    torque?: number; // Nm
    transmission?: string; // e.g., "8-speed Automatic"
    drivetrain?: string; // e.g., "AWD"
    fuelType?: string; // e.g., "Gasoline", "Diesel", "Electric"
    mileage?: { // Fuel economy
      city?: number;
      highway?: number;
      combined?: number;
      unit: string; // "mpg" or "l/100km"
    };
    co2Emissions?: number; // g/km
    acceleration?: { // 0-60 mph or 0-100 km/h
      value: number;
      unit: string; // "seconds"
    };
    topSpeed?: {
      value: number;
      unit: string; // "mph" or "km/h"
    };
    dimensions?: {
      lengthMm?: number;
      widthMm?: number;
      heightMm?: number;
      wheelbaseMm?: number;
      cargoVolumeL?: number;
    };
    weightKg?: number;
    seatingCapacity?: number;
  };
  features?: {
    safety?: string[];
    comfort?: string[];
    technology?: string[];
    interior?: string[];
    exterior?: string[];
  };
  runningCosts?: {
    insuranceGroup?: number;
    roadTaxPerYear?: number;
  };
  ratings?: { // e.g., 1-5 stars
    overall?: number;
    safety?: number;
    reliability?: number;
    performance?: number;
    fuelEconomy?: number;
  };
}

const sampleCars: ApiVehicle[] = [
  {
    id: "bmw-320i-2024",
    make: "BMW",
    model: "3 Series",
    variant: "320i M Sport",
    year: 2024,
    price: {
      amount: 38500,
      currency: "GBP"
    },
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
    specifications: {
      engine: "2.0L Turbo Petrol",
      horsepower: 184,
      torque: 300,
      transmission: "8-speed Automatic",
      drivetrain: "RWD",
      fuelType: "Petrol",
      mileage: {
        combined: 44.1,
        unit: "mpg"
      },
      co2Emissions: 145,
      acceleration: {
        value: 7.1,
        unit: "seconds"
      },
      topSpeed: {
        value: 155,
        unit: "mph"
      },
      seatingCapacity: 5
    },
    features: {
      safety: ["ABS", "ESP", "6 Airbags", "Lane Departure Warning"],
      comfort: ["Climate Control", "Heated Seats", "Cruise Control"],
      technology: ["iDrive", "Apple CarPlay", "Digital Cockpit"]
    },
    runningCosts: {
      insuranceGroup: 28,
      roadTaxPerYear: 190
    },
    ratings: {
      overall: 4.5,
      safety: 4.8,
      performance: 4.6
    }
  },
  {
    id: "audi-a4-2023",
    make: "Audi",
    model: "A4",
    variant: "S Line 35 TFSI",
    year: 2023,
    price: {
      amount: 36000,
      currency: "GBP"
    },
    imageUrl: "https://images.unsplash.com/photo-1617083278319-3ff21418000c?w=400&h=250&fit=crop",
    specifications: {
      engine: "2.0L Mild Hybrid Petrol",
      horsepower: 150,
      torque: 270,
      transmission: "7-speed S tronic",
      drivetrain: "FWD",
      fuelType: "Petrol",
      mileage: {
        combined: 46.3,
        unit: "mpg"
      },
      co2Emissions: 138,
      acceleration: {
        value: 8.9,
        unit: "seconds"
      },
      topSpeed: {
        value: 140,
        unit: "mph"
      },
      seatingCapacity: 5
    },
    features: {
      safety: ["Pre-sense City", "ABS", "Multiple Airbags"],
      comfort: ["3-zone Climate Control", "Leather Seats", "Parking Sensors"],
      technology: ["MMI Navigation Plus", "Virtual Cockpit", "Audi Connect"]
    },
    runningCosts: {
      insuranceGroup: 22,
      roadTaxPerYear: 180
    },
    ratings: {
      overall: 4.3,
      safety: 4.7,
      reliability: 4.2
    }
  },
  {
    id: "mercedes-c200-2024",
    make: "Mercedes-Benz",
    model: "C-Class",
    variant: "AMG Line",
    year: 2024,
    price: {
      amount: 42000,
      currency: "GBP"
    },
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=250&fit=crop",
    specifications: {
      engine: "1.5L Turbo Petrol with Mild Hybrid",
      horsepower: 204,
      torque: 300,
      transmission: "9G-TRONIC Automatic",
      drivetrain: "RWD",
      fuelType: "Petrol",
      mileage: {
        combined: 42.8,
        unit: "mpg"
      },
      co2Emissions: 150,
      acceleration: {
        value: 7.3,
        unit: "seconds"
      },
      topSpeed: {
        value: 150,
        unit: "mph"
      },
      seatingCapacity: 5,
      dimensions: {
        lengthMm: 4751,
        widthMm: 1820,
        heightMm: 1438,
        wheelbaseMm: 2865
      }
    },
    features: {
      safety: ["Active Brake Assist", "Attention Assist", "Blind Spot Assist"],
      comfort: ["THERMATIC Automatic Climate Control", "ARTICO man-made leather upholstery", "Ambient lighting"],
      technology: ["MBUX Infotainment System", "11.9-inch Central Display", "Wireless Charging"]
    },
    runningCosts: {
      insuranceGroup: 30,
      roadTaxPerYear: 190
    },
    ratings: {
      overall: 4.6,
      safety: 4.9,
      performance: 4.5,
      comfort: 4.7
    }
  }
];

export async function GET(request: Request) {
  // In a real scenario, you might use request.url to get query parameters
  // For now, we just return the sample data
  return NextResponse.json(sampleCars);
}
