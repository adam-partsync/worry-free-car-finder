"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Brain,
  Shield,
  Search,
  Clock,
  CheckCircle,
  Star,
  Users,
  Zap,
  Heart,
  Award,
  TrendingUp,
  FileCheck,
  MapPin,
  Gauge,
  Calendar,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Wrench,
  Settings,
  HelpCircle,
  Phone,
  MessageCircle,
  Lock
} from "lucide-react";
import Link from "next/link";

const comprehensiveFeatures = [
  {
    icon: Shield,
    title: "✅ Transparent Search Experience",
    features: [
      {
        name: "MOT History Integration",
        description: "Instantly view past MOT results, advisories, mileage trends, and potential red flags."
      },
      {
        name: "Vehicle Fault Check",
        description: "Spot common problems associated with specific models—before you buy."
      },
      {
        name: "Full Price Comparison",
        description: "See how listed prices stack up across platforms, so you don't overpay."
      },
      {
        name: "Dealer Background Reports",
        description: "Know who you're buying from—how long they've been trading, reviews, FCA registration, VAT status, and more."
      }
    ]
  },
  {
    icon: Brain,
    title: "🧠 Smarter Decision-Making",
    features: [
      {
        name: "Ownership Cost Calculator",
        description: "Estimate running costs over 1–2 years including tax, insurance, fuel, and servicing."
      },
      {
        name: "Condition-Based Valuation",
        description: "Go beyond age and mileage—our system considers service history, past repairs, and ownership count."
      },
      {
        name: "Tyre & Maintenance Finder",
        description: "Enter your tyre size or car model and instantly find the best local tyre deals and garage servicing options."
      },
      {
        name: "Realistic Buying Expectations",
        description: "Clear guidance on what to expect based on your budget (e.g., if you're buying a 10-year-old car, we explain what that really means for condition and reliability)."
      }
    ]
  },
  {
    icon: Lock,
    title: "🔒 Total Peace of Mind",
    features: [
      {
        name: "Vehicle History Check Option",
        description: "Optional full HPI-style report, paid only when you're serious about a car."
      },
      {
        name: "OBD Scanner Support",
        description: "Buy our custom scanner to check a car during or after purchase—know what the engine's hiding."
      },
      {
        name: "MOT Station Risk Warnings",
        description: "We flag MOT stations with poor reputations or repeated complaints."
      },
      {
        name: "Know Your Rights",
        description: "Clear breakdown of buyer protection laws and what to do if something goes wrong."
      },
      {
        name: "Instant Letter Generator",
        description: "Having an issue post-sale? We help you draft the right message to the dealer."
      }
    ]
  },
  {
    icon: Car,
    title: "🚘 Support Beyond the Sale",
    features: [
      {
        name: "Find Trusted Garages & Bodyshops",
        description: "Based on your car type and location, we recommend where to go for reliable service or bodywork."
      },
      {
        name: "Understand a Car Issue",
        description: "Input symptoms like noises or vibrations—we help you make sense of it and what to do next."
      }
    ]
  },
  {
    icon: Users,
    title: "🧭 Built for Everyday Drivers",
    features: [
      {
        name: "No Technical Jargon",
        description: "Whether you're buying your first car or your tenth, we give you the tools to feel confident."
      },
      {
        name: "No Pressure",
        description: "Just facts, support, and transparency at every step."
      }
    ]
  }
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Search",
    description: "Our intelligent search understands what you're really looking for, not just keywords.",
    benefits: ["Natural language queries", "Smart recommendations", "Personalized results"]
  },
  {
    icon: Shield,
    title: "Complete MOT History",
    description: "Real DVLA MOT data with detailed test history, mileage verification, and defect analysis.",
    benefits: ["Official DVLA integration", "Full test history", "Defect explanations"]
  },
  {
    icon: FileCheck,
    title: "Verified Listings",
    description: "Every car comes with comprehensive checks and verified seller information.",
    benefits: ["Background checks", "Document verification", "Seller ratings"]
  },
  {
    icon: Search,
    title: "Advanced Filtering",
    description: "Find exactly what you need with our comprehensive filter system.",
    benefits: ["Multiple search criteria", "Location-based results", "Price range options"]
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "No more endless browsing. We bring the best matches directly to you.",
    benefits: ["Quick results", "Pre-filtered quality", "Time-saving tools"]
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    description: "We only work with trusted dealers and verified private sellers.",
    benefits: ["Rated sellers", "Quality assurance", "Customer protection"]
  }
];

const stats = [
  { number: "50,000+", label: "Happy Customers", icon: Users },
  { number: "98%", label: "Customer Satisfaction", icon: Heart },
  { number: "24/7", label: "Support Available", icon: Clock },
  { number: "500+", label: "Trusted Dealers", icon: Award }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Manchester",
    rating: 5,
    text: "Found my perfect family car in just 10 minutes! The MOT history feature gave me complete confidence in my purchase.",
    carBought: "2019 Honda CR-V"
  },
  {
    name: "Mike Chen",
    location: "London",
    rating: 5,
    text: "The AI search understood exactly what I meant by 'sporty but practical'. Saved me weeks of searching!",
    carBought: "2020 BMW 3 Series"
  },
  {
    name: "Emma Wilson",
    location: "Birmingham",
    rating: 5,
    text: "As a first-time buyer, the detailed explanations and MOT history made me feel confident about my decision.",
    carBought: "2018 Toyota Yaris"
  }
];

const whyChooseReasons = [
  {
    icon: Shield,
    title: "Worry-Free Guarantee",
    description: "Complete transparency with official DVLA data, verified listings, and comprehensive vehicle history."
  },
  {
    icon: Brain,
    title: "Intelligent Matching",
    description: "Our AI understands your needs and lifestyle to recommend cars that truly fit your requirements."
  },
  {
    icon: TrendingUp,
    title: "Best Value Promise",
    description: "We help you find the best deals by comparing prices across multiple sources and highlighting great value cars."
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Our team of car experts is available to help you throughout your car buying journey."
  }
];

export default function WhyChoosePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Worry Free Car Finder
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              How We Make Car Buying Easier
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              At Worry Free Car Finder, we've rethought every part of the car buying and ownership experience.
              Here's exactly how we take the stress, guesswork, and risk out of your journey—while putting you in full control.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/search">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-5 w-5 mr-2" />
                  Start Your Search
                </Button>
              </Link>
              <Link href="/mot-check">
                <Button size="lg" variant="outline">
                  <Shield className="h-5 w-5 mr-2" />
                  Check MOT History
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comprehensive Features Section */}
          <div className="mb-16">
            <div className="space-y-12">
              {comprehensiveFeatures.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <section.icon className="h-8 w-8 text-blue-600 mr-4" />
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.features.map((feature, featureIndex) => (
                      <Card key={featureIndex} className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 p-2 rounded-full shrink-0 mt-1">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {feature.name}
                              </h3>
                              <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* MOT History Feature Highlight */}
          <Card className="mb-16 border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                    🔧 NEW FEATURE
                  </Badge>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Official DVLA MOT History
                  </h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    We're the first platform to integrate directly with the official DVLA MOT History API.
                    Get complete, verified MOT test history for any vehicle including test dates, results,
                    mileage readings, and detailed defect information.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                      Complete test timeline with exact dates
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Gauge className="h-5 w-5 text-blue-600 mr-3" />
                      Verified mileage readings to spot clocking
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FileCheck className="h-5 w-5 text-blue-600 mr-3" />
                      Detailed failure reasons and advisories
                    </div>
                  </div>
                  <Link href="/mot-check" className="inline-block mt-6">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Shield className="h-5 w-5 mr-2" />
                      Try MOT Checker
                    </Button>
                  </Link>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="text-center mb-4">
                    <h4 className="font-semibold text-gray-900">Sample MOT History</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-400">
                      <div>
                        <div className="font-medium text-green-800">2024 MOT</div>
                        <div className="text-sm text-green-600">PASSED - 45,234 miles</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">PASS</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <div>
                        <div className="font-medium text-yellow-800">2023 MOT</div>
                        <div className="text-sm text-yellow-600">PASSED - 43,127 miles</div>
                        <div className="text-xs text-yellow-600">2 advisories</div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">ADVISORY</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                      <div>
                        <div className="font-medium text-blue-800">2022 MOT</div>
                        <div className="text-sm text-blue-600">PASSED - 41,562 miles</div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">PASS</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <Card className="mb-16 border-0 shadow-xl bg-gradient-to-r from-gray-50 to-blue-50">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Worry Less. Drive Smarter. Own with Confidence.
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Welcome to the only car platform built around your peace of mind. Whether you're buying your first car or your tenth,
                we give you the tools to feel confident. No technical jargon. No pressure. Just facts, support, and transparency at every step.
              </p>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Find Your Perfect Car?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of satisfied customers who found their ideal car with complete confidence.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/search">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Zap className="h-5 w-5 mr-2" />
                    Start Searching Now
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <Shield className="h-5 w-5 mr-2" />
                    Explore Our Tools
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
