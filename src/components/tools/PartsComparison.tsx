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
  Wrench,
  Search,
  ShoppingCart,
  Star,
  MapPin,
  Clock,
  Shield,
  Truck,
  Filter,
  SortAsc,
  ExternalLink,
  Heart,
  AlertTriangle,
  CheckCircle,
  Info,
  Phone,
  Globe,
  Mail
} from "lucide-react";

interface PartResult { // This is the component's interface
  id: string;
  name: string;
  partNumber: string;
  brand: string;
  price: number;
  originalPrice?: number;
  supplier: string; // Map from ApiPartResult.supplierName
  supplierRating: number; // Map from ApiPartResult.supplierRating (ensure default like 0 if undefined)
  supplierReviews: number; // Map from ApiPartResult.supplierReviewCount (ensure default like 0 if undefined)
  inStock: boolean; // Map from ApiPartResult.isInStock
  stockLevel: 'high' | 'medium' | 'low' | string; // Map from ApiPartResult.stockLevelDescription (provide default)
  delivery: { // Map from ApiPartResult.deliveryInfo
    time: string; // Map from deliveryInfo.timeText
    cost: number; // Map from deliveryInfo.costAmount
    options: string[]; // Map from deliveryInfo.availableOptions (ensure default like [])
  };
  warranty: string; // Map from ApiPartResult.warrantyInformation
  quality: 'OEM' | 'OE' | 'Aftermarket' | 'Pattern' | string; // Map from ApiPartResult.qualityDescription
  compatibility: string[]; // Map from ApiPartResult.compatibilityNotes (ensure default like [])
  images: string[]; // Map from ApiPartResult.imageUrls
  features: string[]; // Map from ApiPartResult.featureList (ensure default like [])
  supplierInfo: { // Map from ApiPartResult.supplierDetails
    location: string; // Map from supplierDetails.locationName (ensure default like 'N/A')
    phone?: string; // Map from supplierDetails.phoneNumber
    website?: string; // Map from supplierDetails.websiteUrl
    email?: string; // Map from supplierDetails.emailAddress
    businessHours: string; // Map from supplierDetails.businessHoursInfo (ensure default like 'N/A')
    returnPolicy: string; // Map from supplierDetails.returnPolicyInfo (ensure default like 'N/A')
  };
}

interface SearchFilters {
  make: string;
  model: string;
  year: string;
  partCategory: string;
  partName: string;
  maxPrice: string;
  quality: string;
  location: string;
  inStockOnly: boolean;
  brandPreference: string;
  sortBy: 'price' | 'rating' | 'delivery' | 'relevance';
}

// ApiPartResult for reference during transformation
// interface ApiPartResult {
//   id: string;
//   name: string;
//   partNumber: string;
//   brand: string;
//   price: number;
//   originalPrice?: number;
//   supplierName: string;
//   supplierRating?: number;
//   supplierReviewCount?: number;
//   isInStock: boolean;
//   stockLevelDescription?: 'high' | 'medium' | 'low' | string;
//   deliveryInfo: {
//     timeText: string;
//     costAmount: number;
//     availableOptions?: string[];
//   };
//   warrantyInformation: string;
//   qualityDescription: 'OEM' | 'OE' | 'Aftermarket' | 'Pattern' | string;
//   compatibilityNotes?: string[];
//   imageUrls: string[];
//   featureList?: string[];
//   supplierDetails?: {
//     locationName?: string;
//     phoneNumber?: string;
//     websiteUrl?: string;
//     emailAddress?: string;
//     businessHoursInfo?: string;
//     returnPolicyInfo?: string;
//   };
// }


const partCategories = [
  { value: 'brakes', label: 'Brakes & Brake Parts', icon: '🛑' },
  { value: 'engine', label: 'Engine Parts', icon: '🔧' },
  { value: 'filters', label: 'Filters', icon: '🌀' },
  { value: 'suspension', label: 'Suspension', icon: '⚙️' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'exhaust', label: 'Exhaust System', icon: '💨' },
  { value: 'cooling', label: 'Cooling System', icon: '❄️' },
  { value: 'transmission', label: 'Transmission', icon: '⚙️' },
  { value: 'lights', label: 'Lights & Bulbs', icon: '💡' },
  { value: 'tyres', label: 'Tyres & Wheels', icon: '⭕' }
];

export default function PartsComparison() {
  const [filters, setFilters] = useState<SearchFilters>({
    make: '',
    model: '',
    year: '',
    partCategory: '',
    partName: '',
    maxPrice: '',
    quality: '',
    location: '',
    inStockOnly: false,
    brandPreference: '',
    sortBy: 'relevance'
  });
  const [results, setResults] = useState<PartResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [savedParts, setSavedParts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    if (!filters.partName.trim()) {
      alert('Please enter a part name or description');
      return;
    }


  const toggleSavePart = (partId: string) => {
    setSavedParts(prev =>
      prev.includes(partId)
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'OEM':
        return <Badge className="bg-green-100 text-green-800">OEM Original</Badge>;
      case 'OE':
        return <Badge className="bg-blue-100 text-blue-800">OE Quality</Badge>;
      case 'Aftermarket':
        return <Badge className="bg-yellow-100 text-yellow-800">Aftermarket</Badge>;
      case 'Pattern':
        return <Badge className="bg-gray-100 text-gray-800">Pattern Part</Badge>;
      default:
        return <Badge variant="outline">{quality}</Badge>;
    }
  };

  const getStockBadge = (stockLevel: string, inStock: boolean) => {
    if (!inStock) {
      return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
    }
    switch (stockLevel) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Limited Stock</Badge>;
      case 'low':
        return <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Wrench className="h-8 w-8 text-blue-600" />
          Parts Price Comparison
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find the best deals on car parts and maintenance items. Compare prices, quality,
          and delivery options from trusted suppliers across the UK.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search Parts</TabsTrigger>
          <TabsTrigger value="results">Compare Results</TabsTrigger>
          <TabsTrigger value="saved">Saved Parts</TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Car Parts
              </CardTitle>
              <CardDescription>
                Enter your vehicle details and the part you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="make">Vehicle Make</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Toyota"
                    value={filters.make}
                    onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Corolla"
                    value={filters.model}
                    onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    placeholder="e.g., 2020"
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
              </div>

              {/* Part Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partCategory">Part Category</Label>
                  <Select value={filters.partCategory} onValueChange={(value) => setFilters(prev => ({ ...prev, partCategory: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {partCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="partName">Part Name / Description *</Label>
                  <Input
                    id="partName"
                    placeholder="e.g., brake pads, oil filter, spark plugs"
                    value={filters.partName}
                    onChange={(e) => setFilters(prev => ({ ...prev, partName: e.target.value }))}
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
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="maxPrice">Max Price (£)</Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        placeholder="e.g., 50"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quality">Quality Type</Label>
                      <Select value={filters.quality} onValueChange={(value) => setFilters(prev => ({ ...prev, quality: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any Quality</SelectItem>
                          <SelectItem value="OEM">OEM Original</SelectItem>
                          <SelectItem value="OE">OE Quality</SelectItem>
                          <SelectItem value="Aftermarket">Aftermarket</SelectItem>
                          <SelectItem value="Pattern">Pattern Part</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Supplier Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., London"
                        value={filters.location}
                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sortBy">Sort Results By</Label>
                      <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="price">Price (Low to High)</SelectItem>
                          <SelectItem value="rating">Supplier Rating</SelectItem>
                          <SelectItem value="delivery">Delivery Speed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStockOnly"
                    checked={filters.inStockOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="inStockOnly">Show in-stock items only</Label>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSearch}
                  disabled={!filters.partName.trim() || loading}
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
                      Find Parts
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
                  Found {results.length} results for "{filters.partName}"
                </h3>
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  <span className="text-sm text-gray-600">Sorted by {filters.sortBy}</span>
                </div>
              </div>

              <div className="space-y-4">
                {results.map((part) => (
                  <Card key={part.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Part Image & Basic Info */}
                        <div className="space-y-3">
                          <img
                            src={part.images[0]}
                            alt={part.name}
                            className="w-full h-32 object-cover rounded-lg bg-gray-100"
                          />
                          <div>
                            <h4 className="font-semibold text-lg">{part.name}</h4>
                            <p className="text-sm text-gray-600">{part.brand}</p>
                            <p className="text-xs text-gray-500">Part #: {part.partNumber}</p>
                          </div>
                        </div>

                        {/* Price & Quality */}
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl font-bold text-green-600">
                                {formatCurrency(part.price)}
                              </span>
                              {part.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatCurrency(part.originalPrice)}
                                </span>
                              )}
                            </div>
                            {part.originalPrice && (
                              <div className="text-sm text-green-600">
                                Save {formatCurrency(part.originalPrice - part.price)}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            {getQualityBadge(part.quality)}
                            {getStockBadge(part.stockLevel, part.inStock)}
                          </div>
                          <div className="text-sm text-gray-600">
                            <Shield className="h-4 w-4 inline mr-1" />
                            {part.warranty} warranty
                          </div>
                        </div>

                        {/* Supplier Info */}
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium">{part.supplier}</h5>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(part.supplierRating)}
                              <span className="text-sm text-gray-600 ml-1">
                                {part.supplierRating} ({part.supplierReviews.toLocaleString()} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {part.supplierInfo.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              {part.delivery.time} (£{part.delivery.cost})
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {part.supplierInfo.businessHours}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                          <div className="flex flex-col gap-2">
                            <Button className="w-full">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Basket
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => toggleSavePart(part.id)}
                              className="w-full"
                            >
                              <Heart className={`h-4 w-4 mr-2 ${savedParts.includes(part.id) ? 'fill-current text-red-500' : ''}`} />
                              {savedParts.includes(part.id) ? 'Saved' : 'Save Part'}
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="flex-1">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1">
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h6 className="font-medium mb-1">Compatibility:</h6>
                            <div className="space-y-1">
                              {part.compatibility.map((comp, index) => (
                                <Badge key={index} variant="outline" className="mr-1 mb-1">
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium mb-1">Features:</h6>
                            <ul className="space-y-1">
                              {part.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-medium mb-1">Delivery Options:</h6>
                            <ul className="space-y-1">
                              {part.delivery.options.map((option, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <Truck className="h-3 w-3 text-blue-600" />
                                  {option}
                                </li>
                              ))}
                            </ul>
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
                  Searching for parts...
                </h3>
                <p className="text-gray-600">
                  Comparing prices from multiple suppliers
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Parts Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or check the spelling
                </p>
                <Button onClick={() => setActiveTab("search")}>
                  Back to Search
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Saved Parts Tab */}
        <TabsContent value="saved" className="space-y-6">
          {savedParts.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Saved Parts ({savedParts.length})</h3>
              {results.filter(part => savedParts.includes(part.id)).map(part => (
                <Card key={part.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={part.images[0]}
                          alt={part.name}
                          className="w-16 h-16 object-cover rounded bg-gray-100"
                        />
                        <div>
                          <h4 className="font-medium">{part.name}</h4>
                          <p className="text-sm text-gray-600">{part.brand} • {part.supplier}</p>
                          <p className="text-lg font-semibold text-green-600">{formatCurrency(part.price)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Buy Now
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSavePart(part.id)}
                        >
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Saved Parts
                </h3>
                <p className="text-gray-600 mb-4">
                  Save parts during your search to compare them later
                </p>
                <Button onClick={() => setActiveTab("search")}>
                  Start Searching
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
            Money-Saving Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <h4 className="font-semibold">Quality Guidance:</h4>
              <ul className="space-y-1">
                <li>• OEM parts are genuine manufacturer parts</li>
                <li>• OE quality offers same specifications as OEM</li>
                <li>• Aftermarket parts can offer good value</li>
                <li>• Pattern parts are budget alternatives</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Shopping Tips:</h4>
              <ul className="space-y-1">
                <li>• Compare total cost including delivery</li>
                <li>• Check supplier ratings and reviews</li>
                <li>• Consider warranty length and terms</li>
                <li>• Verify part compatibility before buying</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
