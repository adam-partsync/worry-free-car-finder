"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PostcodeInput from "@/components/ui/PostcodeInput";
import {
  Search,
  Brain,
  Filter,
  MapPin,
  PoundSterling,
  Calendar,
  Gauge,
  Car,
  Star,
  Clock,
  Eye
} from "lucide-react";
import Link from "next/link";
import ChatInterface from "@/components/search/ChatInterface";

const carMakes = [
  "Audi", "BMW", "Ford", "Honda", "Hyundai", "Kia", "Mazda", "Mercedes-Benz",
  "Nissan", "Peugeot", "Renault", "Seat", "Skoda", "Toyota", "Vauxhall", "Volkswagen"
];

const yearOptions = Array.from({ length: 25 }, (_, i) => 2025 - i);

// Mock search results - updated to include diverse car types including sporty cars
const mockResults = [
  {
    id: '1',
    title: '2018 Mazda MX-5 2.0 Sport Nav+ 2dr',
    price: 17995,
    year: 2018,
    mileage: 24000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'London',
    seller: 'Sports Car Specialists',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
    features: ['Reliable', 'Sporty', 'Fuel Efficient', 'Low Insurance', 'Convertible', 'Two Seats']
  },
  {
    id: '2',
    title: '2019 Toyota GT86 2.0 D-4S 2dr',
    price: 19500,
    year: 2019,
    mileage: 18000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Birmingham',
    seller: 'Reliable Sports Cars',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
    features: ['Reliable', 'Sporty', 'Performance', 'Two Seats', 'Low Running Costs']
  },
  {
    id: '3',
    title: '2019 Toyota Corolla 1.2T Design 5dr CVT',
    price: 14995,
    year: 2019,
    mileage: 32000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'London',
    seller: 'Premium Cars Ltd',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=250&fit=crop',
    features: ['Air Conditioning', 'Bluetooth', 'USB', 'Electric Windows', 'Reliable', 'Fuel Efficient']
  },
  {
    id: '4',
    title: '2017 Audi TT 2.0 TFSI Sport Coupe 2dr',
    price: 22750,
    year: 2017,
    mileage: 31000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Manchester',
    seller: 'Premium Coupes',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop',
    features: ['Sporty', 'Premium', 'Two Seats', 'Performance', 'Technology']
  },
  {
    id: '5',
    title: '2016 BMW Z4 2.0i sDrive28i M Sport 2dr',
    price: 18995,
    year: 2016,
    mileage: 35000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Bristol',
    seller: 'Elite Motors',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop',
    features: ['Sporty', 'Convertible', 'Two Seats', 'Premium', 'Reliable']
  },
  {
    id: '6',
    title: '2020 Honda Civic 1.0 VTEC Turbo SR 5dr',
    price: 16500,
    year: 2020,
    mileage: 28000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'Birmingham',
    seller: 'Reliable Motors',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1627796744639-c7ea25411d47?w=400&h=250&fit=crop',
    features: ['Navigation', 'Cruise Control', 'Parking Sensors', 'Heated Seats', 'Reliable']
  }
];

export default function SearchPage() {
  const [searchType, setSearchType] = useState<"ai" | "filters">("filters"); // Default to filters for testing
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof mockResults>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [formData, setFormData] = useState({
    aiQuery: "",
    budget: "",
    make: "",
    model: "",
    yearFrom: "",
    yearTo: "",
    mileageMax: "",
    fuelType: "any",
    transmission: "any",
    postcode: "",
    radius: "25"
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔧 Search triggered - Search Type:', searchType);
    console.log('🔧 Form Data:', formData);

    // For AI search, the ChatInterface component handles this
    if (searchType === "ai") {
      console.log('🔧 AI search - ChatInterface will handle this');
      return;
    }

    // Validate that at least one filter is set
    const hasFilters = formData.make || formData.model || formData.budget || formData.yearFrom || formData.fuelType || formData.transmission;
    if (!hasFilters) {
      alert('Please select at least one filter (make, budget, year, etc.) before searching.');
      return;
    }

    console.log('🔧 Starting filters search...');
    // For filter-based searches, use ChatGPT API
    setLoading(true);
    setHasSearched(true);

    try {
      // Build a query from the filters
      const queryParts = [];

      if (formData.make) {
        queryParts.push(formData.make);
      }
      if (formData.model) {
        queryParts.push(formData.model);
      }
      if (formData.budget) {
        queryParts.push(`under £${formData.budget}`);
      }
      if (formData.yearFrom) {
        queryParts.push(`from ${formData.yearFrom}`);
      }
      if (formData.mileageMax) {
        queryParts.push(`under ${formData.mileageMax} miles`);
      }
      if (formData.fuelType && formData.fuelType !== "any") {
        queryParts.push(formData.fuelType);
      }
      if (formData.transmission && formData.transmission !== "any") {
        queryParts.push(formData.transmission);
      }

      const query = queryParts.length > 0 ? queryParts.join(', ') : 'cars';

      // Call the AI search API to get ChatGPT recommendations
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          postcode: formData.postcode,
          radius: formData.radius
        }),
      });

      const data = await response.json();

      if (response.ok && data.listings) {
        console.log('✅ Search API Success - Got listings:', data.listings.length);
        console.log('✅ First listing:', data.listings[0]);
        console.log('✅ Data source:', data.source);
        setResults(data.listings);
      } else {
        console.error('❌ Search API failed:', data);
        throw new Error(data.error || 'Search failed');
      }

    } catch (error) {
      console.error("Search failed:", error);
      // Fallback to mock results
      setResults(mockResults.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

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
                <Link href="/tools" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tools
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Search Cars
            </h1>
            <p className="text-xl text-gray-600">
              Find your perfect car using AI or detailed filters
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Find Your Perfect Car
              </CardTitle>
              <CardDescription>
                Use our AI search or detailed filters to find exactly what you're looking for
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "ai" | "filters")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="ai" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Search
                  </TabsTrigger>
                  <TabsTrigger value="filters" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Detailed Filters
                  </TabsTrigger>
                </TabsList>

                  <TabsContent value="ai" className="space-y-6">
                    <ChatInterface initialQuery={formData.aiQuery} />
                  </TabsContent>

                  <TabsContent value="filters" className="space-y-6">
                    <form onSubmit={handleSearch} className="space-y-6">
                    {/* Move the old AI content to filters if needed */}
                    <div className="space-y-2 hidden">
                      <Label htmlFor="ai-query" className="text-base font-medium">
                        Describe what you're looking for
                      </Label>
                      <p className="text-sm text-gray-600 mb-3">
                        💬 This will open ChatGPT in a new tab with your query for intelligent car recommendations
                      </p>
                      <Textarea
                        id="ai-query"
                        placeholder="E.g., 'I need a reliable family car under £15,000 with low mileage, good for commuting and weekend trips. Prefer automatic transmission and good fuel economy.'"
                        value={formData.aiQuery}
                        onChange={(e) => updateFormData("aiQuery", e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                    </div>
                    {/* Budget */}
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="flex items-center gap-2">
                        <PoundSterling className="h-4 w-4" />
                        Maximum Budget
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="15000"
                        value={formData.budget}
                        onChange={(e) => updateFormData("budget", e.target.value)}
                      />
                    </div>

                    {/* Make and Model */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="make">Make</Label>
                        <Select value={formData.make} onValueChange={(value) => updateFormData("make", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select make" />
                          </SelectTrigger>
                          <SelectContent>
                            {carMakes.map((make) => (
                              <SelectItem key={make} value={make.toLowerCase()}>
                                {make}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Model (Optional)</Label>
                        <Input
                          id="model"
                          placeholder="e.g., Golf, Focus"
                          value={formData.model}
                          onChange={(e) => updateFormData("model", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Year Range */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year-from" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Year From
                        </Label>
                        <Select value={formData.yearFrom} onValueChange={(value) => updateFormData("yearFrom", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any year" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year-to">Year To</Label>
                        <Select value={formData.yearTo} onValueChange={(value) => updateFormData("yearTo", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any year" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Mileage and Location */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mileage" className="flex items-center gap-2">
                          <Gauge className="h-4 w-4" />
                          Maximum Mileage
                        </Label>
                        <Input
                          id="mileage"
                          type="number"
                          placeholder="50000"
                          value={formData.mileageMax}
                          onChange={(e) => updateFormData("mileageMax", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postcode" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Postcode
                        </Label>
                        <PostcodeInput
                          id="postcode"
                          value={formData.postcode}
                          onChange={(value) => updateFormData("postcode", value)}
                        />
                      </div>
                    </div>

                    {/* Fuel Type and Transmission */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fuel-type">Fuel Type</Label>
                        <Select value={formData.fuelType} onValueChange={(value) => updateFormData("fuelType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any fuel type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any fuel type</SelectItem>
                            <SelectItem value="petrol">Petrol</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transmission">Transmission</Label>
                        <Select value={formData.transmission} onValueChange={(value) => updateFormData("transmission", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any transmission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any transmission</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="automatic">Automatic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Search Button for filters only */}
                    <div className="pt-6">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                        onClick={(e: React.MouseEvent) => {
                          console.log('🔧 BUTTON CLICKED!');
                          console.log('🔧 Search type:', searchType);
                          console.log('🔧 Form data:', formData);
                          console.log('🔧 Event:', e);

                          // Manual trigger as backup
                          if (searchType === "filters") {
                            console.log('🔧 Manual trigger backup');
                            handleSearch(e);
                          }
                        }}
                      >
                        <Search className="h-5 w-5 mr-2" />
                        {loading ? "Searching..." : "Search Cars"}
                      </Button>
                    </div>
                    </form>
                  </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? "Searching..." : `Found ${results.length} cars`}
                </h2>
                {!loading && results.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                    <Link href="/search/advanced">
                      <Button variant="outline" size="sm">
                        Advanced Search
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (console.log('Current results:', results), results.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((car) => (
                    <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative">
                        <img
                          src={car.image}
                          alt={car.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-xs font-semibold">
                          £{car.price.toLocaleString()}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{car.title}</h3>
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <div className="flex items-center justify-between">
                            <span>{car.year}</span>
                            <span>{car.mileage?.toLocaleString() || 'N/A'} miles</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{car.fuelType}</span>
                            <span>{car.transmission}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{car.location}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{car.rating?.toFixed(1) || '4.0'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          Sold by: {car.seller}
                          {car.source && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {car.source}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {car.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {car.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{car.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Clock className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No cars found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or browse all available cars
                    </p>
                    <Button variant="outline" onClick={() => {
                      setFormData({
                        aiQuery: "",
                        budget: "",
                        make: "",
                        model: "",
                        yearFrom: "",
                        yearTo: "",
                        mileageMax: "",
                        postcode: "",
                        radius: "25"
                      });
                      setHasSearched(false);
                      setResults([]);
                    }}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
