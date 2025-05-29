import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Calculator,
  Search,
  FileText,
  UserCheck,
  TrendingUp,
  MapPin,
  Wrench,
  Clock,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "MOT History Check",
    description: "Complete MOT history with mileage trend analysis and failure warnings",
    badge: "Essential",
    color: "text-green-600"
  },
  {
    icon: Calculator,
    title: "Running Cost Calculator",
    description: "Accurate 1-2 year cost estimates including fuel, insurance, tax, and maintenance",
    badge: "Popular",
    color: "text-blue-600"
  },
  {
    icon: UserCheck,
    title: "Dealer Risk Assessment",
    description: "Verify dealer age, reviews, FCA registration, and VAT status",
    badge: "Safety",
    color: "text-purple-600"
  },
  {
    icon: FileText,
    title: "Vehicle History Check",
    description: "Comprehensive background check including finance, insurance claims, and theft records",
    badge: "Premium",
    color: "text-orange-600"
  },
  {
    icon: Search,
    title: "Real-time Listings",
    description: "Live data from eBay UK with plans to expand to AutoTrader and Gumtree",
    badge: "Live",
    color: "text-red-600"
  },
  {
    icon: TrendingUp,
    title: "Buying Expectation Engine",
    description: "Realistic price predictions and market analysis for informed negotiations",
    badge: "Smart",
    color: "text-indigo-600"
  }
];

const upcomingFeatures = [
  {
    icon: MapPin,
    title: "Service Garage Finder",
    description: "Recommended garages based on your car type and location"
  },
  {
    icon: Wrench,
    title: "OBD Diagnostics",
    description: "Fault code lookup and diagnostic tool recommendations"
  },
  {
    icon: FileText,
    title: "Legal Rights Guide",
    description: "Know your rights and get auto-generated complaint templates"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Current Features */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Car Buying Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to make an informed car purchase decision, from initial search to final purchase
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <feature.icon className={`h-10 w-10 ${feature.color} mb-4`} />
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            🚀 Coming Soon
          </Badge>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Phase 2 Features
          </h3>
          <p className="text-lg text-gray-600">
            Even more tools to make your car ownership journey worry-free
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {upcomingFeatures.map((feature, index) => (
            <Card key={index} className="opacity-75 border-dashed">
              <CardHeader className="text-center">
                <feature.icon className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <CardTitle className="text-lg text-gray-700">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h3>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Search</h4>
              <p className="text-sm text-gray-600">
                Use AI or filters to find cars that match your needs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Analyze</h4>
              <p className="text-sm text-gray-600">
                Get instant MOT history, cost estimates, and dealer checks
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Verify</h4>
              <p className="text-sm text-gray-600">
                Run comprehensive vehicle and dealer background checks
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2">Buy</h4>
              <p className="text-sm text-gray-600">
                Make an informed purchase with confidence
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
