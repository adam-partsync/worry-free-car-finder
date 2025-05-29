"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  Shield,
  Calculator,
  Search,
  FileCheck,
  HelpCircle,
  TrendingUp,
  Users,
  ChevronRight,
  Wrench,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  LineChart,
  ShoppingCart,
  Scale,
  Truck,
  ShoppingBag,
  Cog
} from "lucide-react";
import Link from "next/link";

// Pre-Purchase Tools - Before buying a car
const prePurchaseTools = [
  {
    icon: Settings,
    title: "Car Buying Wizard",
    description: "Let us guide you through every step of finding and buying your perfect car with our comprehensive wizard.",
    path: "/wizard",
    badge: "GUIDED JOURNEY",
    badgeColor: "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200",
    features: ["Step-by-step guidance", "All tools integrated", "Progress tracking", "Personalized journey"]
  },
  {
    icon: HelpCircle,
    title: "Help Me Choose",
    description: "Answer a few questions about your needs and get personalized car recommendations tailored to your lifestyle.",
    path: "/help-me-choose",
    badge: "PERSONALIZED",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    features: ["Lifestyle matching", "Budget optimization", "Need assessment", "Smart recommendations"]
  },
  {
    icon: DollarSign,
    title: "Finance Calculator",
    description: "Compare loan vs lease options, calculate monthly payments, and get affordability guidance for your budget.",
    path: "/finance-calculator",
    badge: "LOAN & LEASE",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    features: ["Loan calculations", "Lease comparisons", "Affordability analysis", "Total cost breakdown"]
  },
  {
    icon: Calculator,
    title: "Car Cost Calculator",
    description: "Estimate total ownership costs including insurance, fuel, servicing, depreciation, and running expenses.",
    path: "/cost-calculator",
    badge: "COMPREHENSIVE",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    features: ["Insurance estimates", "Fuel costs", "Service costs", "Depreciation analysis"]
  },
  {
    icon: Shield,
    title: "MOT History Checker",
    description: "Get complete official DVLA MOT history for any vehicle including test dates, results, mileage, and defects.",
    path: "/mot-check",
    badge: "OFFICIAL DVLA DATA",
    badgeColor: "bg-green-100 text-green-800 border-green-200",
    features: ["Official DVLA integration", "Complete test timeline", "Mileage verification", "Defect explanations"]
  },
  {
    icon: Users,
    title: "Dealer Background Check",
    description: "Research car dealers with trading history, customer reviews, FCA registration, and reputation analysis.",
    path: "/dealer-check",
    badge: "TRUST & SAFETY",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    features: ["Trading history", "Customer reviews", "FCA registration", "Reputation scoring"]
  },
  {
    icon: FileCheck,
    title: "Vehicle History Check",
    description: "Comprehensive vehicle background including previous owners, accidents, finance checks, and stolen status.",
    path: "/vehicle-check",
    badge: "DETAILED REPORT",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    features: ["Ownership history", "Accident records", "Finance checks", "Stolen vehicle check"]
  },
  {
    icon: TrendingUp,
    title: "Price Analysis Tool",
    description: "Compare car prices across platforms, get market valuation, and identify great deals or overpriced vehicles.",
    path: "/price-analysis",
    badge: "MARKET INSIGHTS",
    badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    features: ["Price comparison", "Market valuation", "Deal analysis", "Trend insights"]
  },
  {
    icon: BarChart3,
    title: "Car Comparison Tool",
    description: "Compare up to 4 vehicles side-by-side with detailed specifications, features, and cost analysis.",
    path: "/car-comparison",
    badge: "SIDE-BY-SIDE",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    features: ["Multi-vehicle comparison", "Detailed specifications", "Feature analysis", "Cost breakdown"]
  },
  {
    icon: LineChart,
    title: "Vehicle Valuation",
    description: "Get accurate vehicle valuations with depreciation forecasting and comprehensive market trend analysis.",
    path: "/vehicle-valuation",
    badge: "DEPRECIATION FORECAST",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    features: ["Current market value", "5-year depreciation forecast", "Market trend analysis", "Valuation factors"]
  },
  {
    icon: Shield,
    title: "Insurance Quote Comparison",
    description: "Compare insurance quotes from leading UK providers with comprehensive coverage analysis and savings identification.",
    path: "/insurance-quotes",
    badge: "MULTI-PROVIDER",
    badgeColor: "bg-green-100 text-green-800 border-green-200",
    features: ["Multiple provider quotes", "Coverage comparison", "Savings identification", "Expert recommendations"]
  },
  {
    icon: Truck,
    title: "Towing Guide & Vehicle Finder",
    description: "Find the perfect car or van for towing. Calculate towing requirements, get vehicle recommendations, and learn about towing safely and legally.",
    path: "/towing-guide",
    badge: "CAPACITY CALCULATOR",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    features: ["Towing capacity calculator", "Vehicle recommendations", "Legal requirements", "Safety guidelines"]
  },
  {
    icon: Scale,
    title: "Legal Advice for Motor Trade",
    description: "Get expert legal guidance for car buying, selling, and motor trade issues. Access rights, regulations, and dispute resolution advice.",
    path: "/legal-advice",
    badge: "EXPERT GUIDANCE",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    features: ["Consumer rights advice", "Trade regulations", "Dispute resolution", "Legal document guidance"]
  }
];

// Post-Purchase Tools - After buying a car
const postPurchaseTools = [
  {
    icon: Wrench,
    title: "Garage Finder",
    description: "Find trusted mechanics and service centers near you with ratings, specializations, and booking options.",
    path: "/garage-finder",
    badge: "TRUSTED GARAGES",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    features: ["Location-based search", "Customer reviews", "Service filtering", "Direct booking"]
  },
  {
    icon: Clock,
    title: "Maintenance Tracker",
    description: "Keep track of your vehicle's service history, upcoming maintenance, and associated costs with detailed logging.",
    path: "/maintenance",
    badge: "SERVICE HISTORY",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    features: ["Service logging", "Cost tracking", "Reminder system", "History timeline"]
  },
  {
    icon: Settings,
    title: "Tyre Shop Finder",
    description: "Find tyre shops near you with price comparison, mobile fitting options, and brand availability.",
    path: "/tyre-shop-finder",
    badge: "MOBILE FITTING",
    badgeColor: "bg-green-100 text-green-800 border-green-200",
    features: ["Location-based search", "Price comparison", "Mobile fitting", "Brand availability"]
  },
  {
    icon: ShoppingCart,
    title: "Parts Price Comparison",
    description: "Find the best deals on car parts and maintenance items. Compare prices, quality, and delivery options from trusted suppliers.",
    path: "/parts-comparison",
    badge: "MULTI-SUPPLIER",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    features: ["Multiple supplier comparison", "Quality filtering", "Delivery options", "Stock availability checking"]
  }
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("pre-purchase");

  const renderToolCard = (tool: any, index: number) => (
    <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
            <tool.icon className="h-6 w-6 text-white" />
          </div>
          <Badge className={tool.badgeColor}>
            {tool.badge}
          </Badge>
        </div>
        <CardTitle className="text-xl text-gray-900 mb-2">
          {tool.title}
        </CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {tool.features.map((feature: string, idx: number) => (
            <li key={idx} className="flex items-center text-sm text-gray-600">
              <ChevronRight className="h-3 w-3 text-green-500 mr-2 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Link href={tool.path}>
          <Button className="w-full group-hover:bg-blue-700 transition-colors">
            Use This Tool
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

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
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/why-choose" className="text-gray-600 hover:text-gray-900 transition-colors">
                  How We Make Car Buying Easier
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Search Cars
                </Link>
                <Link href="/help-me-choose" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Help Me Choose
                </Link>
              </nav>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button size="sm">Get Started</Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Car Buying Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Everything you need to make informed car buying decisions. Organized by when you need them in your car buying journey.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/search">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-5 w-5 mr-2" />
                  Start Car Search
                </Button>
              </Link>
              <Link href="/help-me-choose">
                <Button size="lg" variant="outline">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Get Recommendations
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{prePurchaseTools.length}</div>
                <div className="text-sm text-gray-600">Pre-Purchase Tools</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <Cog className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{postPurchaseTools.length}</div>
                <div className="text-sm text-gray-600">Post-Purchase Tools</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">5min</div>
                <div className="text-sm text-gray-600">Average Check Time</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">Free</div>
                <div className="text-sm text-gray-600">Basic Checks</div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="pre-purchase" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Pre-Purchase Tools
              </TabsTrigger>
              <TabsTrigger value="post-purchase" className="flex items-center gap-2">
                <Cog className="h-4 w-4" />
                Post-Purchase Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pre-purchase" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Pre-Purchase Tools</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Essential tools to help you research, evaluate, and buy the perfect car with confidence.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {prePurchaseTools.map(renderToolCard)}
              </div>
            </TabsContent>

            <TabsContent value="post-purchase" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Post-Purchase Tools</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Keep your car running smoothly with maintenance tracking, garage finding, and parts sourcing tools.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {postPurchaseTools.map(renderToolCard)}
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center mt-16">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Car Journey?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Whether you're buying or maintaining, we have the tools to help you succeed.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/search">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Search className="h-5 w-5 mr-2" />
                    Start Car Search
                  </Button>
                </Link>
                <Link href="/help-me-choose">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Get Recommendations
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
