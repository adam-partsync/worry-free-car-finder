import { NextResponse } from 'next/server';

interface ApiDealerInfo {
  id: string;
  name: string;
  address?: string;
  postcode?: string;
  phone?: string;
  websiteUrl?: string;
  companyNumber?: string;
  vatNumber?: string;
  vatVerified?: boolean;
  fcaStatus?: {
    isRegistered: boolean;
    registrationNumber?: string;
    permissions?: string[];
    status?: string;
  };
  reviewsSummary?: {
    averageRating?: number;
    totalReviewCount?: number;
    sources?: Array<{
      platformName: string;
      rating?: number;
      reviewCount?: number;
      urlToReviews?: string;
    }>;
  };
  yearsInBusiness?: number;
  riskAssessment?: {
    score?: number; // Typically a numerical score, e.g., 0-100
    level?: 'Low' | 'Medium' | 'High' | string; // Risk level category
    summary?: string; // Brief textual summary of risk
  };
  keyWarnings?: string[]; // Array of potential issues or warnings
  positiveHighlights?: string[]; // Array of positive aspects
}

const generateSampleDealerInfo = (name: string, postcode?: string | null): ApiDealerInfo => {
  const baseId = name.toLowerCase().replace(/\s+/g, '-') + (postcode ? '-' + postcode.toLowerCase().replace(/\s+/g, '') : '');
  return {
    id: `sim-${baseId}`,
    name: name || "Simulated Motors", // Use provided name or default
    address: "123 Simulated Avenue, Test Town",
    postcode: postcode || "TS1 1ST",
    phone: "01234 555666",
    websiteUrl: "www.simulatedmotors.co.uk",
    companyNumber: "SIM00123",
    vatNumber: "GB1234567SIM",
    vatVerified: true,
    fcaStatus: {
      isRegistered: true,
      registrationNumber: "SIMFCA123",
      permissions: ["Credit Broking", "Debt Adjusting", "Insurance Mediation"],
      status: "Active"
    },
    reviewsSummary: {
      averageRating: 4.3,
      totalReviewCount: 250,
      sources: [
        { platformName: "Google Reviews", rating: 4.4, reviewCount: 120, urlToReviews: "#google-reviews-simulated" },
        { platformName: "Trustpilot", rating: 4.2, reviewCount: 80, urlToReviews: "#trustpilot-simulated" },
        { platformName: "AutoAdvisor", rating: 4.5, reviewCount: 50, urlToReviews: "#autoadvisor-simulated" }
      ]
    },
    yearsInBusiness: (name === "New Simulated Dealers") ? 1 : 8,
    riskAssessment: {
      score: (name === "Risky Simulated Dealers") ? 55 : 75,
      level: (name === "Risky Simulated Dealers") ? 'Medium' : 'Low',
      summary: (name === "Risky Simulated Dealers") 
        ? "Moderate risk: Some concerns raised in online feedback and short trading history." 
        : "Low risk: Generally positive profile, standard checks passed. Good trading history."
    },
    keyWarnings: (name === "Risky Simulated Dealers") 
      ? ["Check recent MOT history on their vehicles.", "Verify warranty terms carefully.", "Mixed reviews on after-sales service."] 
      : ["Ensure all paperwork is accurate before signing.", "Verify vehicle history report independently if possible."],
    positiveHighlights: [
      "Good selection of vehicles reported.", 
      "Helpful customer service mentioned in some reviews.", 
      "Registered with FCA and VAT active.",
      (name !== "New Simulated Dealers") ? "Established business with several years of operation." : "New business, potentially offering competitive deals."
    ]
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dealerName = searchParams.get('dealerName');
  const postcode = searchParams.get('postcode');

  if (!dealerName) {
    return NextResponse.json({ error: "Dealer name is required" }, { status: 400 });
  }

  const dealerInfo = generateSampleDealerInfo(dealerName, postcode);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json(dealerInfo);
}
