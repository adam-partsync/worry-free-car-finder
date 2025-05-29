import { NextResponse } from 'next/server';

interface ApiGarage {
  id: string;
  name: string;
  address: string;
  postcode: string;
  phone?: string;
  website?: string;
  rating?: number; // 0-5
  reviewCount?: number;
  distance?: number; // in miles
  servicesOffered: string[];
  specializations?: string[];
  openingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  imageUrl?: string;
  priceRange?: '£' | '££' | '£££';
  certifications?: string[];
  mobileFitting?: boolean;
  emergencyService?: boolean;
}

const allSampleGarages: ApiGarage[] = [
  {
    id: "1",
    name: "AutoCare Plus Central",
    address: "123 Main Street, Anytown",
    postcode: "AT1 1AA",
    phone: "01234 567890",
    website: "autocareplus-central.example.com",
    rating: 4.7,
    reviewCount: 150,
    distance: 1.2,
    servicesOffered: ["MOT Testing", "Service & Repair", "Diagnostics", "Tyres", "Air Conditioning"],
    specializations: ["German Cars", "EVs"],
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "8:00 AM - 1:00 PM",
      sunday: "Closed"
    },
    location: { latitude: 51.5074, longitude: -0.1278 }, // London-ish
    imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop",
    priceRange: "££",
    certifications: ["DVSA Approved", "Bosch Car Service", "IMI Certified"],
    mobileFitting: false,
    emergencyService: true,
  },
  {
    id: "2",
    name: "QuickFit Tyres & Exhausts",
    address: "45 Industrial Road, Anytown",
    postcode: "AT2 2BB",
    phone: "01234 567891",
    website: "quickfit-simulated.example.com",
    rating: 4.2,
    reviewCount: 90,
    distance: 2.5,
    servicesOffered: ["Tyre Fitting", "Wheel Alignment", "Puncture Repair", "Exhaust Systems"],
    specializations: ["Tyres Only", "Fast-Fit"],
    openingHours: {
      monday: "8:30 AM - 5:30 PM",
      tuesday: "8:30 AM - 5:30 PM",
      wednesday: "8:30 AM - 5:30 PM",
      thursday: "8:30 AM - 5:30 PM",
      friday: "8:30 AM - 5:30 PM",
      saturday: "9:00 AM - 12:30 PM",
      sunday: "Closed"
    },
    location: { latitude: 51.5174, longitude: -0.1378 }, // Slightly different London
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop",
    priceRange: "£",
    certifications: ["TyreSafe Approved Centre"],
    mobileFitting: true,
    emergencyService: false,
  },
  {
    id: "3",
    name: "Prestige Motors Anytown",
    address: "7 Luxury Lane, Anytown",
    postcode: "AT1 1AA", // Same postcode as #1 for testing postcode filter
    phone: "01234 567892",
    website: "prestigemotors.example.com",
    rating: 4.9,
    reviewCount: 210,
    distance: 0.8,
    servicesOffered: ["Full Service", "Advanced Diagnostics", "Body Work", "Performance Tuning"],
    specializations: ["Luxury Brands", "Sports Cars"],
    openingHours: {
      monday: "9:00 AM - 7:00 PM",
      tuesday: "9:00 AM - 7:00 PM",
      wednesday: "9:00 AM - 7:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 7:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    location: { latitude: 51.5050, longitude: -0.1290 }, // Near #1
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=200&fit=crop",
    priceRange: "£££",
    certifications: ["Manufacturer Approved (Various)", "Master Technician Certified"],
    mobileFitting: false,
    emergencyService: true,
  },
  {
    id: "4",
    name: "Mobile Mechanic Mike",
    address: "Mobile Service - Covers Anytown & Surrounds",
    postcode: "AT3 3CC", // Different postcode
    phone: "07700 900000",
    website: "mobilemikerepairs.example.com",
    rating: 4.5,
    reviewCount: 75,
    distance: 5.0, // Simulating it being further as it's mobile base
    servicesOffered: ["Mobile Service & Repair", "Diagnostics", "Battery Replacement", "Brakes"],
    specializations: ["Roadside Assistance", "Home Servicing"],
    openingHours: {
      monday: "24 Hours", // Example of different hours
      tuesday: "24 Hours",
      wednesday: "24 Hours",
      thursday: "24 Hours",
      friday: "24 Hours",
      saturday: "Emergency Only",
      sunday: "Emergency Only"
    },
    location: { latitude: 51.4999, longitude: -0.1111 }, // Different area
    imageUrl: "https://images.unsplash.com/photo-1606607258672-b4c91e9ab9d8?w=400&h=200&fit=crop",
    priceRange: "££",
    certifications: ["Fully Insured", "City & Guilds Mechanics"],
    mobileFitting: true,
    emergencyService: true,
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postcodeQuery = searchParams.get('postcode');
  const serviceTypeQuery = searchParams.get('serviceType');
  // const radius = searchParams.get('radius'); // Example for future use

  let filteredGarages = allSampleGarages;

  // Simulate postcode filtering
  if (postcodeQuery) {
    // Simple simulation: if a postcode is given, filter to garages that roughly match,
    // or adjust distances. For exact match, we'd use a geocoding API in a real app.
    // Here, we'll filter if the query matches a known sample postcode's prefix.
    const normalizedPostcodeQuery = postcodeQuery.toLowerCase().replace(/\s+/g, '');
    
    filteredGarages = allSampleGarages.filter(garage => 
      garage.postcode.toLowerCase().replace(/\s+/g, '').startsWith(normalizedPostcodeQuery.substring(0,3)) // Match first part of postcode
    );
    // If no direct matches, could return a default set or all, but for simulation, this is fine.
    // And adjust distances slightly for "found" ones
    if (filteredGarages.length > 0) {
        filteredGarages = filteredGarages.map((g, index) => ({ 
            ...g, 
            distance: parseFloat(( (g.distance || 2) * (0.8 + Math.random() * 0.4) ).toFixed(1)) // Randomize distance a bit
        }));
    } else {
        // If no postcode match, return a couple of general options or an empty array
        // For this simulation, let's return an empty array if postcode doesn't yield results.
        // Or alternatively, don't filter by postcode if it doesn't match any.
        // For now, if postcode is specified and doesn't match any, return empty.
         filteredGarages = []; 
    }
  }

  // Simulate serviceType filtering
  if (serviceTypeQuery && serviceTypeQuery.toLowerCase() !== "all services") {
    filteredGarages = filteredGarages.filter(garage =>
      garage.servicesOffered.some(service =>
        service.toLowerCase().includes(serviceTypeQuery.toLowerCase())
      )
    );
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  return NextResponse.json(filteredGarages);
}
