"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Shield,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Car,
  Activity,
  Calendar,
  Eye,
  Star,
  Settings,
  Download,
  Bell,
  Wrench
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalSearches: number;
    motChecks: number;
    vehicleChecks: number;
    dealerChecks: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'search' | 'mot_check' | 'vehicle_check' | 'dealer_check';
    title: string;
    subtitle?: string;
    status?: string;
    date: string;
    data?: any;
  }>;
  savedSearches: Array<{
    id: string;
    name: string;
    filters: any;
    alertEnabled: boolean;
    lastRun: string;
    resultsCount: number;
  }>;
  vehicleChecks: Array<{
    id: string;
    registration: string;
    checkType: string;
    status: string;
    price: number;
    createdAt: string;
    results?: any;
  }>;
}

export default function DashboardContent({ userId }: { userId: string }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();

      if (response.ok) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'search':
        return <Search className="h-4 w-4 text-blue-600" />;
      case 'mot_check':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'vehicle_check':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'dealer_check':
        return <Car className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unable to load dashboard</h3>
        <p className="text-gray-600">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Searches</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.stats.totalSearches}</p>
              </div>
              <Search className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MOT Checks</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.stats.motChecks}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vehicle Checks</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardData.stats.vehicleChecks}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dealer Checks</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData.stats.dealerChecks}</p>
              </div>
              <Car className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="searches">Saved Searches</TabsTrigger>
          <TabsTrigger value="checks">Vehicle Checks</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{activity.title}</p>
                        {activity.subtitle && (
                          <p className="text-sm text-gray-600 truncate">{activity.subtitle}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      {activity.status && getStatusBadge(activity.status)}
                    </div>
                  ))}
                  {dashboardData.recentActivity.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tools and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/search" className="flex flex-col items-center gap-2">
                      <Search className="h-6 w-6" />
                      <span className="text-sm">Search Cars</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/mot-check" className="flex flex-col items-center gap-2">
                      <Shield className="h-6 w-6" />
                      <span className="text-sm">MOT Check</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/vehicle-check" className="flex flex-col items-center gap-2">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Vehicle Check</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/maintenance" className="flex flex-col items-center gap-2">
                      <Wrench className="h-6 w-6" />
                      <span className="text-sm">Maintenance</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/price-analysis" className="flex flex-col items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      <span className="text-sm">Price Analysis</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/insurance-quotes" className="flex flex-col items-center gap-2">
                      <Shield className="h-6 w-6" />
                      <span className="text-sm">Insurance</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/car-comparison" className="flex flex-col items-center gap-2">
                      <Car className="h-6 w-6" />
                      <span className="text-sm">Compare Cars</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/vehicle-valuation" className="flex flex-col items-center gap-2">
                      <Calculator className="h-6 w-6" />
                      <span className="text-sm">Vehicle Value</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/parts-comparison" className="flex flex-col items-center gap-2">
                      <Wrench className="h-6 w-6" />
                      <span className="text-sm">Parts Prices</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4">
                    <Link href="/tyre-shop-finder" className="flex flex-col items-center gap-2">
                      <Car className="h-6 w-6" />
                      <span className="text-sm">Tyre Shops</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="searches" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Saved Searches</h3>
            <Button asChild>
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                New Search
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.savedSearches.map((search) => (
              <Card key={search.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{search.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {search.alertEnabled && (
                        <Bell className="h-4 w-4 text-blue-600" />
                      )}
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>Last run: {new Date(search.lastRun).toLocaleDateString()}</p>
                      <p>{search.resultsCount} results found</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View Results
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {dashboardData.savedSearches.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved searches yet</h3>
                  <p className="text-gray-600 mb-4">
                    Save your search criteria to get notified of new matches
                  </p>
                  <Button asChild>
                    <Link href="/search">Create Your First Search</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="checks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Vehicle History Checks</h3>
            <Button asChild>
              <Link href="/vehicle-check">
                <FileText className="h-4 w-4 mr-2" />
                New Check
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {dashboardData.vehicleChecks.map((check) => (
              <Card key={check.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{check.registration}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {check.checkType} Check • £{(check.price / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(check.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(check.status)}
                      {check.status === 'completed' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View Report
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {dashboardData.vehicleChecks.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No vehicle checks yet</h3>
                  <p className="text-gray-600 mb-4">
                    Run comprehensive background checks on vehicles you're considering
                  </p>
                  <Button asChild>
                    <Link href="/vehicle-check">Run Your First Check</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <h3 className="text-lg font-semibold">All Activity</h3>

          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      {activity.subtitle && (
                        <p className="text-sm text-gray-600">{activity.subtitle}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                    {activity.status && getStatusBadge(activity.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <h3 className="text-lg font-semibold">Account Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure when you receive email alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">New search results</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Vehicle check completed</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Price drop alerts</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Weekly market updates</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search Preferences</CardTitle>
                <CardDescription>
                  Default settings for your searches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Default Search Radius</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option value="25">25 miles</option>
                      <option value="50">50 miles</option>
                      <option value="100">100 miles</option>
                      <option value="nationwide">Nationwide</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Preferred Fuel Type</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option value="">No preference</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
