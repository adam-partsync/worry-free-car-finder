"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Car,
  Truck,
  Shield,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Navigation,
  Globe,
  Calendar,
  Wrench,
  Award,
  Info,
  Target
} from "lucide-react";

interface TyreShop {
  id: string;
  name: string;
  address: string;
  postcode: string;
  distance: number;
  rating: number;
  reviewCount: number;
  phone: string;
  website?: string;
  email?: string;
  openingHours: string;
  services: string[];
  specialties: string[];
  brands: string[];
  features: string[];
  mobileFitting: boolean;
  emergencyService: boolean;
  currentOffers: string[];
  priceRange: 'budget' | 'mid-range' | 'premium';
  certifications: string[];
  tyreTypes: string[];
  averageInstallTime: string;
  parkingAvailable: boolean;
  bookingRequired: boolean;
}

interface SearchFilters {
  postcode: string;
  tyreSize: string;
  vehicleMake: string;
  vehicleModel: string;
  radius: string;
  serviceType: string;
  brands: string[];
  priceRange: string;
  mobileFitting: boolean;
  emergencyService: boolean;
  sortBy: 'distance' | 'rating' | 'price' | 'reviews';
}

// Mock tyre shop data
const mockTyreShops: TyreShop[] = [
  {
    id: "1",
    name: "Kwik Fit",
    address: "123 High Street, London",
    postcode: "SW1A 1AA",
    distance: 0.8,
    rating: 4.2,
    reviewCount: 1847,
    phone: "020 7123 4567",
    website: "kwik-fit.com",
    email: "london@kwik-fit.com",
    openingHours: "Mon-Fri: 8am-6pm, Sat: 8am-5pm, Sun: 10am-4pm",
    services: ["Tyre Fitting", "Wheel Alignment", "Balancing", "Puncture Repair", "MOT", "Brakes"],
    specialties: ["Run-flat tyres", "Performance tyres", "4x4 tyres"],
    brands: ["Michelin", "Bridgestone", "Continental", "Pirelli", "Goodyear", "Dunlop"],
    features: ["Free tyre check", "Price match guarantee", "24-month warranty"],
    mobileFitting: true,
    emergencyService: true,
    currentOffers: ["Buy 2 get £20 off", "Free fitting on 4 tyres"],
    priceRange: "mid-range",
    certifications: ["TyreSafe", "ISO 9001"],
    tyreTypes: ["Summer", "Winter", "All-Season", "Run-flat", "Performance"],
    averageInstallTime: "45 mins",
    parkingAvailable: true,
    bookingRequired: false
  },
  {
    id: "2",
    name: "ATS Euromaster",
    address: "456 Station Road, London",
    postcode: "SW1A 2BB",
    distance: 1.2,
    rating: 4.5,
    reviewCount: 923,
    phone: "020 7234 5678",
    website: "atseuromaster.co.uk",
    openingHours: "Mon-Fri: 7:30am-6pm, Sat: 8am-4pm",
    services: ["Tyre Fitting", "Wheel Alignment", "Fleet Services", "Commercial Tyres", "Breakdown"],
    specialties: ["Commercial vehicles", "Fleet management", "Emergency callout"],
    brands: ["Michelin", "Continental", "Bridgestone", "Yokohama", "Hankook"],
    features: ["Same-day fitting", "Fleet discounts", "Emergency breakdown"],
    mobileFitting: true,
    emergencyService: true,
    currentOffers: ["10% off first purchase", "Free puncture repair"],
    priceRange: "premium",
    certifications: ["TyreSafe", "AA Approved", "RAC Approved"],
    tyreTypes: ["Summer", "Winter", "All-Season", "Commercial", "Agricultural"],
    averageInstallTime: "35 mins",
    parkingAvailable: true,
    bookingRequired: true
  },
  {
    id: "3",
    name: "National Tyres",
    address: "789 King's Road, London",
    postcode: "SW1A 3CC",
    distance: 1.8,
    rating: 4.0,
    reviewCount: 1205,
    phone: "020 7345 6789",
    website: "national.co.uk",
    openingHours: "Mon-Fri: 8am-6pm, Sat: 8am-5pm",
    services: ["Tyre Fitting", "MOT", "Servicing", "Brakes", "Batteries", "Exhausts"],
    specialties: ["Budget tyres", "Part-worn tyres", "Motorcycle tyres"],
    brands: ["Michelin", "Goodyear", "Dunlop", "Falken", "Toyo", "Budget brands"],
    features: ["Competitive prices", "Part-worn available", "Multi-service center"],
    mobileFitting: false,
    emergencyService: false,
    currentOffers: ["£15 off 4 tyres", "Free MOT with 4 tyres"],
    priceRange: "budget",
    certifications: ["TyreSafe"],
    tyreTypes: ["Summer", "Winter", "All-Season", "Part-worn", "Motorcycle"],
    averageInstallTime: "50 mins",
    parkingAvailable: true,
    bookingRequired: false
  },
  {
    id: "4",
    name: "FastFit Mobile Tyres",
    address: "Mobile Service - London Area",
    postcode: "Various",
    distance: 0.0,
    rating: 4.7,
    reviewCount: 456,
    phone: "07700 123456",
    website: "fastfitmobile.co.uk",
    email: "bookings@fastfitmobile.co.uk",
    openingHours: "Mon-Sun: 7am-7pm (Mobile service)",
    services: ["Mobile Tyre Fitting", "Emergency Callout", "Fleet Services"],
    specialties: ["Mobile fitting", "Same-day service", "Emergency breakdown"],
    brands: ["Michelin", "Continental", "Bridgestone", "Pirelli"],
    features: ["Come to you", "Same-day service", "Evening appointments"],
    mobileFitting: true,
    emergencyService: true,
    currentOffers: ["No callout fee weekdays", "£10 off mobile fitting"],
    priceRange: "mid-range",
    certifications: ["TyreSafe", "Mobile Tyre Fitters Association"],
    tyreTypes: ["Summer", "Winter", "All-Season", "Performance"],
    averageInstallTime: "30 mins",
    parkingAvailable: false,
    bookingRequired: true
  },
  {
    id: "5",
    name: "Premium Tyre Centre",
    address: "321 Luxury Lane, London",
    postcode: "SW1A 4DD",
    distance: 2.3,
    rating: 4.8,
    reviewCount: 234,
    phone: "020 7456 7890",
    website: "premiumtyres.co.uk",
    openingHours: "Mon-Fri: 8am-6pm, Sat: 9am-4pm",
    services: ["Premium Tyre Fitting", "Wheel Alignment", "Performance Upgrades", "Custom Wheels"],
    specialties: ["Luxury vehicles", "Performance cars", "Custom wheels"],
    brands: ["Michelin", "Pirelli", "Continental", "Yokohama", "Nitto", "Toyo"],
    features: ["Luxury service", "Performance specialists", "Custom solutions"],
    mobileFitting: true,
    emergencyService: true,
    currentOffers: ["Free wheel alignment with 4 tyres"],
    priceRange: "premium",
    certifications: ["TyreSafe", "Performance Tyre Specialists"],
    tyreTypes: ["Summer", "Winter", "Performance", "Ultra-High Performance"],
    averageInstallTime: "60 mins",
    parkingAvailable: true,
    bookingRequired: true
  }
];

const tyreServices = [
  "Tyre Fitting",
  "Puncture Repair",
  "Wheel Alignment",
  "Wheel Balancing",
  "Tyre Pressure Check",
  "Mobile Fitting",
  "Emergency Callout",
  "Fleet Services"
];

const tyreBrands = [
  "Michelin",
  "Continental",
  "Bridgestone",
  "Pirelli",
  "Goodyear",
  "Dunlop",
  "Yokohama",
  "Hankook",
  "Falken",
  "Toyo"
];

export default function TyreShopFinder() {
  const [filters, setFilters] = useState<SearchFilters>({
    postcode: '',
    tyreSize: '',
    vehicleMake: '',
    vehicleModel: '',
    radius: '10',
    serviceType: '',
    brands: [],
    priceRange: '',
    mobileFitting: false,
    emergencyService: false,
    sortBy: 'distance'
  });

  const [results, setResults] = useState<TyreShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  const handleSearch = async () => {
    if (!filters.postcode.trim()) {
      alert('Please enter a postcode to search');
      return;
    }

    setLoading(true);
    setActiveTab("results");

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter and sort mock data
    const filteredResults = mockTyreShops.filter(shop => {
      const matchesService = !filters.serviceType || shop.services.includes(filters.serviceType);
      const matchesBrands = filters.brands.length === 0 || filters.brands.some(brand => shop.brands.includes(brand));
      const matchesPriceRange = !filters.priceRange || shop.priceRange === filters.priceRange;
      const matchesMobile = !filters.mobileFitting || shop.mobileFitting;
      const matchesEmergency = !filters.emergencyService || shop.emergencyService;
      const withinRadius = shop.distance <= Number(filters.radius);

      return matchesService && matchesBrands && matchesPriceRange && matchesMobile && matchesEmergency && withinRadius;
    });

    // Sort results
    switch (filters.sortBy) {
      case 'distance':
        filteredResults.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        filteredResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filteredResults.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    setResults(filteredResults);
    setLoading(false);
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock postcode based on location
          setFilters(prev => ({ ...prev, postcode: 'SW1A 1AA' }));
        },
        () => {
          alert('Unable to detect location. Please enter postcode manually.');
        }
      );
    }
  };

  const formatDistance = (distance: number) => {
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)} miles`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getPriceRangeBadge = (priceRange: string) => {
    switch (priceRange) {
      case 'budget':
        return <Badge className="bg-green-100 text-green-800">Budget</Badge>;
      case 'mid-range':
        return <Badge className="bg-blue-100 text-blue-800">Mid-range</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
      default:
        return <Badge variant="outline">{priceRange}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Target className="h-8 w-8 text-blue-600" />
          Tyre Shop Finder
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find the best tyre shops near you. Compare prices, services, and book appointments
          for fitting, repairs, and maintenance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Find Tyre Shops</TabsTrigger>
          <TabsTrigger value="results">Search Results</TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search for Tyre Shops
              </CardTitle>
              <CardDescription>
                Enter your location and requirements to find the best tyre shops near you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location & Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postcode">Postcode *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="postcode"
                      placeholder="e.g., SW1A 1AA"
                      value={filters.postcode}
                      onChange={(e) => setFilters(prev => ({ ...prev, postcode: e.target.value.toUpperCase() }))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLocationDetection}
                      className="shrink-0"
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="radius">Search Radius</Label>
                  <Select value={filters.radius} onValueChange={(value) => setFilters(prev => ({ ...prev, radius: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Within 5 miles</SelectItem>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="25">Within 25 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vehicle & Tyre Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tyreSize">Tyre Size</Label>
                  <Input
                    id="tyreSize"
                    placeholder="e.g., 205/55R16"
                    value={filters.tyreSize}
                    onChange={(e) => setFilters(prev => ({ ...prev, tyreSize: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleMake">Vehicle Make</Label>
                  <Input
                    id="vehicleMake"
                    placeholder="e.g., Toyota"
                    value={filters.vehicleMake}
                    onChange={(e) => setFilters(prev => ({ ...prev, vehicleMake: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Vehicle Model</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="e.g., Corolla"
                    value={filters.vehicleModel}
                    onChange={(e) => setFilters(prev => ({ ...prev, vehicleModel: e.target.value }))}
                  />
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? 'Hide' : 'Show'} Advanced Filters
                </Button>

                {showFilters && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="serviceType">Required Service</Label>
                        <Select value={filters.serviceType} onValueChange={(value) => setFilters(prev => ({ ...prev, serviceType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any Service</SelectItem>
                            {tyreServices.map(service => (
                              <SelectItem key={service} value={service}>{service}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priceRange">Price Range</Label>
                        <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any Price Range</SelectItem>
                            <SelectItem value="budget">Budget</SelectItem>
                            <SelectItem value="mid-range">Mid-range</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="sortBy">Sort Results By</Label>
                        <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="distance">Distance</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="reviews">Review Count</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.mobileFitting}
                          onChange={(e) => setFilters(prev => ({ ...prev, mobileFitting: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Mobile fitting available</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.emergencyService}
                          onChange={(e) => setFilters(prev => ({ ...prev, emergencyService: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Emergency service</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSearch}
                  disabled={!filters.postcode.trim() || loading}
                  className="px-8 py-3"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Search className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Find Tyre Shops
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {results.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Found {results.length} tyre shops near {filters.postcode}
                </h3>
                <Badge variant="outline">
                  Sorted by {filters.sortBy}
                </Badge>
              </div>

              <div className="space-y-4">
                {results.map((shop) => (
                  <Card key={shop.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Shop Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{shop.name}</h4>
                              <div className="flex items-center gap-1 mt-1">
                                {renderStars(shop.rating)}
                                <span className="text-sm text-gray-600 ml-1">
                                  {shop.rating} ({shop.reviewCount.toLocaleString()} reviews)
                                </span>
                              </div>
                            </div>
                            {getPriceRangeBadge(shop.priceRange)}
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{shop.address}</span>
                              <Badge variant="outline" className="ml-auto">
                                {formatDistance(shop.distance)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{shop.openingHours}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{shop.phone}</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {shop.mobileFitting && (
                              <Badge variant="outline" className="text-xs">
                                <Truck className="h-3 w-3 mr-1" />
                                Mobile Fitting
                              </Badge>
                            )}
                            {shop.emergencyService && (
                              <Badge variant="outline" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Emergency Service
                              </Badge>
                            )}
                            {shop.parkingAvailable && (
                              <Badge variant="outline" className="text-xs">
                                <Car className="h-3 w-3 mr-1" />
                                Parking
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Services & Brands */}
                        <div>
                          <h5 className="font-medium mb-2">Services</h5>
                          <div className="space-y-1">
                            {shop.services.slice(0, 4).map((service, index) => (
                              <div key={index} className="flex items-center gap-1 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {service}
                              </div>
                            ))}
                            {shop.services.length > 4 && (
                              <p className="text-xs text-gray-500">+{shop.services.length - 4} more</p>
                            )}
                          </div>

                          <h5 className="font-medium mb-2 mt-4">Brands</h5>
                          <div className="flex flex-wrap gap-1">
                            {shop.brands.slice(0, 3).map((brand, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {brand}
                              </Badge>
                            ))}
                            {shop.brands.length > 3 && (
                              <span className="text-xs text-gray-500">+{shop.brands.length - 3}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions & Offers */}
                        <div className="space-y-3">
                          {/* Current Offers */}
                          {shop.currentOffers.length > 0 && (
                            <div>
                              <h5 className="font-medium text-green-800 mb-1">Current Offers</h5>
                              {shop.currentOffers.map((offer, index) => (
                                <div key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                                  {offer}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Button className="w-full">
                              <Phone className="h-4 w-4 mr-2" />
                              Call Now
                            </Button>
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" size="sm">
                                <Navigation className="h-4 w-4 mr-1" />
                                Directions
                              </Button>
                              {shop.website && (
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Website
                                </Button>
                              )}
                            </div>
                            {shop.bookingRequired && (
                              <Button variant="outline" className="w-full">
                                <Calendar className="h-4 w-4 mr-2" />
                                Book Appointment
                              </Button>
                            )}
                          </div>

                          {/* Additional Info */}
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Install time: ~{shop.averageInstallTime}</div>
                            {shop.certifications.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                {shop.certifications.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Searching for tyre shops...
                </h3>
                <p className="text-gray-600">
                  Finding the best options near you
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try expanding your search radius or adjusting your filters
                </p>
                <Button onClick={() => setActiveTab("search")}>
                  Back to Search
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Tyre Shopping Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <h4 className="font-semibold">Before You Buy:</h4>
              <ul className="space-y-1">
                <li>• Check your current tyre size on the sidewall</li>
                <li>• Consider your driving style and conditions</li>
                <li>• Compare prices including fitting costs</li>
                <li>• Check warranty terms and conditions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Money-Saving Tips:</h4>
              <ul className="space-y-1">
                <li>• Buy tyres in pairs or sets for better deals</li>
                <li>• Look for seasonal promotions and offers</li>
                <li>• Consider mobile fitting to save time</li>
                <li>• Keep receipts for warranty claims</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
