"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Car,
  Search,
  Heart,
  Clock,
  TrendingUp,
  Shield,
  Star,
  Bell,
  Plus,
  ArrowRight,
  Calendar,
  MapPin,
  Filter,
  BarChart3,
  User,
  Settings,
  CreditCard,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Bookmark,
  Eye,
  MessageCircle
} from "lucide-react";

interface SavedSearch {
  id: string;
  title: string;
  criteria: string;
  resultsCount: number;
  lastUpdated: string;
  alertsEnabled: boolean;
}

interface RecentActivity {
  id: string;
  type: 'search' | 'favorite' | 'inquiry' | 'valuation';
  description: string;
  timestamp: string;
  vehicle?: {
    make: string;
    model: string;
    year: number;
    price: number;
  };
}

interface Recommendation {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  matchScore: number;
  reason: string;
  image: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [realRecentActivity, setRealRecentActivity] = useState<RecentActivity[]>([]);

  // Mock data for recommendations (keep for now)
  const [mockSavedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      title: "Family SUV under £25k",
      criteria: "SUV, 2018+, <£25,000, Automatic",
      resultsCount: 147,
      lastUpdated: "2024-01-15",
      alertsEnabled: true
    },
    {
      id: "2",
      title: "Sports Car BMW/Audi",
      criteria: "BMW/Audi, Sports, 2020+, <£45,000",
      resultsCount: 23,
      lastUpdated: "2024-01-12",
      alertsEnabled: false
    },
    {
      id: "3",
      title: "Electric Cars London",
      criteria: "Electric, London area, 2021+",
      resultsCount: 89,
      lastUpdated: "2024-01-10",
      alertsEnabled: true
    }
  ]);

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "search",
      description: "Searched for family SUVs",
      timestamp: "2 hours ago",
      vehicle: { make: "Toyota", model: "RAV4", year: 2022, price: 28500 }
    },
    {
      id: "2",
      type: "favorite",
      description: "Added BMW X3 to favorites",
      timestamp: "1 day ago",
      vehicle: { make: "BMW", model: "X3", year: 2021, price: 42000 }
    },
    {
      id: "3",
      type: "valuation",
      description: "Got valuation for Honda Civic",
      timestamp: "2 days ago",
      vehicle: { make: "Honda", model: "Civic", year: 2019, price: 18500 }
    },
    {
      id: "4",
      type: "inquiry",
      description: "Contacted dealer about Audi A4",
      timestamp: "3 days ago",
      vehicle: { make: "Audi", model: "A4", year: 2020, price: 35000 }
    }
  ]);

  const [recommendations] = useState<Recommendation[]>([
    {
      id: "1",
      make: "Toyota",
      model: "Camry Hybrid",
      year: 2023,
      price: 32500,
      location: "Manchester",
      matchScore: 95,
      reason: "Perfect match for your eco-friendly preferences",
      image: "/api/placeholder/300/200"
    },
    {
      id: "2",
      make: "Volkswagen",
      model: "Tiguan",
      year: 2022,
      price: 28900,
      location: "Birmingham",
      matchScore: 87,
      reason: "Great family SUV within your budget",
      image: "/api/placeholder/300/200"
    },
    {
      id: "3",
      make: "BMW",
      model: "320i",
      year: 2021,
      price: 26500,
      location: "London",
      matchScore: 82,
      reason: "Premium sedan with excellent reliability",
      image: "/api/placeholder/300/200"
    }
  ]);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard");
      return;
    }

    setIsLoading(false);
  }, [status, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search className="h-4 w-4" />;
      case 'favorite': return <Heart className="h-4 w-4" />;
      case 'inquiry': return <MessageCircle className="h-4 w-4" />;
      case 'valuation': return <BarChart3 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  const userName = session?.user?.name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your car search
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  New Search
                </Link>
              </Button>
              <Button asChild>
                <Link href="/help-me-choose">
                  <Plus className="h-4 w-4 mr-2" />
                  Get Recommendations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{savedSearches.length}</div>
                  <div className="text-sm text-gray-600">Saved Searches</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-600">Favorite Cars</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Bell className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-600">Active Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">£28.5K</div>
                  <div className="text-sm text-gray-600">Avg. Budget</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="searches">Saved Searches</TabsTrigger>
            <TabsTrigger value="recommendations">For You</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest searches and interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0 mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          {activity.vehicle && (
                            <p className="text-sm text-gray-600">
                              {activity.vehicle.year} {activity.vehicle.make} {activity.vehicle.model} - {formatCurrency(activity.vehicle.price)}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Activity
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Quick Tools
                  </CardTitle>
                  <CardDescription>
                    Fast access to our most popular features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col" asChild>
                      <Link href="/insurance-quotes">
                        <Shield className="h-6 w-6 mb-2" />
                        <span className="text-xs">Insurance Quotes</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" asChild>
                      <Link href="/vehicle-valuation">
                        <BarChart3 className="h-6 w-6 mb-2" />
                        <span className="text-xs">Car Valuation</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" asChild>
                      <Link href="/mot-check">
                        <CheckCircle className="h-6 w-6 mb-2" />
                        <span className="text-xs">MOT Check</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" asChild>
                      <Link href="/finance-calculator">
                        <CreditCard className="h-6 w-6 mb-2" />
                        <span className="text-xs">Finance Calculator</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Insights
                </CardTitle>
                <CardDescription>
                  Current trends in the car market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">↓ 3.2%</div>
                    <div className="text-sm text-gray-600">Average prices vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">↑ 15%</div>
                    <div className="text-sm text-gray-600">Electric car searches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">7 days</div>
                    <div className="text-sm text-gray-600">Average time on market</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Searches Tab */}
          <TabsContent value="searches" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Saved Searches</h2>
              <Button asChild>
                <Link href="/search">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Search
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savedSearches.map((search) => (
                <Card key={search.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{search.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {search.criteria}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {search.alertsEnabled && (
                          <Badge variant="secondary" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Alerts On
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>{search.resultsCount} cars found</span>
                      <span>Updated {search.lastUpdated}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Search className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cars Picked Just For You</h2>
              <p className="text-gray-600">Based on your search history and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((car) => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600">
                        {car.matchScore}% match
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary">
                        <MapPin className="h-3 w-3 mr-1" />
                        {car.location}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-bold text-lg">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(car.price)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {car.reason}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Name</span>
                    <span className="font-medium">{session?.user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="font-medium">{session?.user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Member since</span>
                    <span className="font-medium">January 2024</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Account status</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email alerts</div>
                        <div className="text-sm text-gray-600">New cars matching your searches</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">On</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Price drop alerts</div>
                        <div className="text-sm text-gray-600">When saved cars reduce in price</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">On</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Market insights</div>
                        <div className="text-sm text-gray-600">Weekly market trend reports</div>
                      </div>
                      <Badge variant="secondary">Off</Badge>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Manage Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
