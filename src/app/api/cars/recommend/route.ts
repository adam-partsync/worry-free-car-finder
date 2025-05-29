import { NextResponse } from 'next/server';

interface ApiCarRecommendation {
  make: string;
  model: string;
  year: string; // Or number
  price: string; // Or an object like {min: number, max: number, currency: string}
  matchScore: number;
  reasons: string[];
  pros: string[];
  cons: string[];
  suitability: string;
  image: string;
  fuelType: string;
  bodyType: string;
}

const sampleRecommendations: ApiCarRecommendation[] = [
  {
    make: "Honda",
    model: "Civic",
    year: "2023",
    price: "£28,000 - £35,000",
    matchScore: 90,
    reasons: ["Sporty design", "Reliable engineering", "Efficient performance"],
    pros: ["Fun to drive", "Good fuel economy for its class", "Spacious interior"],
    cons: ["CVT can be noisy", "Infotainment a bit dated"],
    suitability: "Great all-rounder for individuals or small families looking for a blend of fun and practicality.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop&auto=format", // Placeholder, replace with actual or better placeholder
    fuelType: "Petrol",
    bodyType: "Hatchback"
  },
  {
    make: "Kia",
    model: "Niro",
    year: "2024",
    price: "£30,000 - £38,000",
    matchScore: 88,
    reasons: ["Available in Hybrid, PHEV, and EV", "Generous warranty", "Practical crossover design"],
    pros: ["Excellent fuel efficiency (Hybrid/PHEV)", "Long warranty period", "User-friendly tech"],
    cons: ["EV range could be better for the price", "Some hard plastics in cabin"],
    suitability: "Ideal for eco-conscious drivers needing a versatile and affordable family crossover.",
    image: "https://images.unsplash.com/photo-1617083278319-3ff21418000c?w=400&h=250&fit=crop&auto=format", // Placeholder
    fuelType: "Hybrid", // Could also be EV or PHEV
    bodyType: "SUV"
  },
  {
    make: "Skoda",
    model: "Octavia",
    year: "2023",
    price: "£26,000 - £34,000",
    matchScore: 82,
    reasons: ["Huge boot space", "Comfortable ride", "Value for money"],
    pros: ["Class-leading practicality", "Smooth and refined engines", "Lots of 'Simply Clever' features"],
    cons: ["Design is a bit conservative", "Infotainment can be slow at times"],
    suitability: "Perfect for families or those needing maximum space and comfort without a premium price tag.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=250&fit=crop&auto=format", // Placeholder
    fuelType: "Petrol", // Also available as Diesel, Hybrid
    bodyType: "Estate" // Or Hatchback
  }
];

export async function POST(request: Request) {
  try {
    // Optional: Read quiz answers from the request body
    // const quizAnswers = await request.json();
    // console.log("Received quiz answers (simulated):", quizAnswers);

    // In a real API, you'd use quizAnswers to filter/generate recommendations.
    // For this simulation, we'll just return a fixed list.

    // Simulate some processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(sampleRecommendations);
  } catch (error) {
    console.error("Error in recommendation API:", error);
    // Check if the error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to fetch recommendations", details: errorMessage }, { status: 500 });
  }
}
