"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import PostcodeInput from "@/components/ui/PostcodeInput";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Car,
  Wrench,
  Shield,
  Award,
  Users,
  Search,
  Filter,
  ExternalLink,
  CheckCircle,
  Calendar,
  PoundSterling,
  Navigation,
  AlertTriangle
} from "lucide-react";

// Interface aligned with ApiGarage, with some fields optional if not always present from API
interface Garage {
  id: string;
  name: string;
  address: string;
  postcode: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  distance?: number;
  priceRange?: "£" | "££" | "£££"; // from ApiGarage
  specializations?: string[];
  services: string[]; // Mapped from servicesOffered
  openingHours?: { // from ApiGarage
    [key: string]: string | undefined; // Ensure compatibility with potential undefined day from API
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  image?: string; // Mapped from imageUrl
  certified?: string[]; // Mapped from certifications
  mobileFitting?: boolean; // from ApiGarage
  emergencyService?: boolean; // from ApiGarage
  location?: { // from ApiGarage
    latitude: number;
    longitude: number;
  };

  // Fields from old Garage interface that might not be in ApiGarage - keep optional
  email?: string;
  features?: string[];
  description?: string;
  established?: number;
}

interface SearchFilters {
  postcode: string;
  radius: number; // This might not be directly used by the current API, but good to keep
  serviceType: string;
  minRating: number; // This will be a client-side filter for now
  priceRange: string[]; // Client-side filter
  certifications: string[]; // Client-side filter
  openNow: boolean; // Client-side filter
}

// ApiGarage structure (for reference during transformation, assuming it's defined elsewhere)
// interface ApiGarage {
//   id: string;
//   name: string;
//   address: string;
//   postcode: string;
//   phone?: string;
//   website?: string;
//   rating?: number;
//   reviewCount?: number;
//   distance?: number;
//   servicesOffered: string[];
//   specializations?: string[];
//   openingHours?: { /* ... */ };
//   location: { latitude: number; longitude: number; };
//   imageUrl?: string;
//   priceRange?: '£' | '££' | '£££';
//   certifications?: string[];
//   mobileFitting?: boolean;
//   emergencyService?: boolean;
// }


const serviceTypes = [
  "All Services",
  "MOT Testing",
  "Full Service",
  "Diagnostics",
  "Tyres",
  "Brakes",
  "Exhaust",
  "Air Conditioning",
  "Bodywork",
  "Electrical"
];

const certifications = [
  "DVSA Approved",
  "Bosch Car Service",
  "AA Approved",
  "RAC Approved",
  "Manufacturer Authorized"
];

export default function GarageFinder() {
  const [filters, setFilters] = useState<SearchFilters>({
    postcode: "",
    radius: 10,
    serviceType: "All Services",
    minRating: 0,
    priceRange: [],
    certifications: [],
    openNow: false
  });

  const [results, setResults] = useState<Garage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = async () => {
    if (!filters.postcode.trim()) {
      alert("Please enter a postcode to search for garages.");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

  const getPriceRangeText = (range?: "£" | "££" | "£££") => {
    if (!range) return "";
    switch (range) {
      case "£": return "Budget-friendly";
      case "££": return "Mid-range";
      case "£££": return "Premium";
      default: return "";
    }
  };

  const isOpenNow = (hours: { [key: string]: string | undefined }) => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = hours[day.toLowerCase() as keyof typeof hours] || hours[day]; // try lowercase first

    if (!todayHours || todayHours === "Closed" || todayHours.toLowerCase().includes("closed")) return false;
    
    // Basic check, assumes format "8:00 AM - 6:00 PM" or "24 Hours"
    // A more robust solution would parse times properly.
    if (todayHours.toLowerCase().includes("24 hours")) return true;

    const parts = todayHours.split('-');
    if (parts.length !== 2) return false; // Invalid format

    const openTimeStr = parts[0].trim();
    const closeTimeStr = parts[1].trim();

    // Super simplified check: if current hour is between typical open/close hours.
    // This is NOT robust. A proper library for date/time manipulation is needed for accuracy.
    const currentHour = now.getHours();
    if (openTimeStr.toLowerCase().includes("am") && closeTimeStr.toLowerCase().includes("pm")) {
      if (currentHour >= 8 && currentHour < 18) return true; // Basic assumption
    }
    // This is a placeholder and needs a real time parsing logic for production
    return false; 
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <MapPin className="h-8 w-8 text-blue-600" />
          Garage Finder
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Find trusted mechanics and service centers near you. Compare ratings, services,
          and prices to make the best choice for your vehicle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Search & Filters Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Search & Filters
              </CardTitle>
              <CardDescription>
                Find garages near your location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="postcode" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Your Postcode
                </Label>
                <PostcodeInput
                  id="postcode"
                  value={filters.postcode}
                  onChange={(value) => updateFilter("postcode", value)}
                />
              </div>

              {/* Radius */}
              <div className="space-y-2">
                <Label>Search Radius: {filters.radius} miles</Label>
                <Select value={filters.radius.toString()} onValueChange={(value) => updateFilter("radius", Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="15">15 miles</SelectItem>
                    <SelectItem value="25">25 miles</SelectItem>
                    <SelectItem value="50">50 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Service Type
                </Label>
                <Select value={filters.serviceType} onValueChange={(value) => updateFilter("serviceType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map(service => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Minimum Rating
                </Label>
                <Select value={filters.minRating.toString()} onValueChange={(value) => updateFilter("minRating", Number.parseFloat(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <PoundSterling className="h-4 w-4" />
                  Price Range
                </Label>
                {["£", "££", "£££"].map(range => (
                  <div key={range} className="flex items-center space-x-2">
                    <Checkbox
                      id={range}
                      checked={filters.priceRange.includes(range)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter("priceRange", [...filters.priceRange, range]);
                        } else {
                          updateFilter("priceRange", filters.priceRange.filter(r => r !== range));
                        }
                      }}
                    />
                    <Label htmlFor={range} className="text-sm">
                      {range} - {getPriceRangeText(range)}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Certifications
                </Label>
                {certifications.map(cert => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={filters.certifications.includes(cert)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilter("certifications", [...filters.certifications, cert]);
                        } else {
                          updateFilter("certifications", filters.certifications.filter(c => c !== cert));
                        }
                      }}
                    />
                    <Label htmlFor={cert} className="text-sm">{cert}</Label>
                  </div>
                ))}
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Find Garages"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          {hasSearched && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? "Searching..." : `Found ${results.length} garages`}
                  {filters.postcode && ` near ${filters.postcode.toUpperCase()}`}
                </h2>
                {!loading && results.length > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Within {filters.radius} miles
                  </Badge>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="overflow-hidden">
                  <div className="animate-pulse">
                    <div className="h-32 bg-gray-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : hasSearched && results.length > 0 ? (
            <div className="space-y-6">
              {results.map(garage => (
                <Card key={garage.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={garage.image}
                        alt={garage.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {garage.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {garage.distance} miles
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {garage.rating} ({garage.reviewCount} reviews)
                            </div>
                            <Badge variant="outline" className={
                              garage.priceRange === "£" ? "text-green-600 border-green-200" :
                              garage.priceRange === "££" ? "text-blue-600 border-blue-200" :
                              "text-purple-600 border-purple-200"
                            }>
                              {garage.priceRange}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{garage.address}</p>
                          <p className="text-sm text-gray-700 mb-3">{garage.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <Clock className="h-4 w-4" />
                            {isOpenNow(garage.openingHours) ? (
                              <span className="text-green-600 font-medium">Open</span>
                            ) : (
                              <span className="text-red-600 font-medium">Closed</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Est. {garage.established}
                          </div>
                        </div>
                      </div>

                      {/* Services & Specializations */}
                      <div className="mb-4">
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Services: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {garage.services.slice(0, 4).map(service => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {garage.services.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{garage.services.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {garage.specializations.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Specializes in: </span>
                            <span className="text-sm text-gray-600">
                              {garage.specializations.join(", ")}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {garage.certified.map(cert => (
                            <Badge key={cert} className="text-xs bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {garage.features.map(feature => (
                            <span key={feature} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Phone className="h-4 w-4 mr-1" />
                          Call {garage.phone}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Navigation className="h-4 w-4 mr-1" />
                          Get Directions
                        </Button>
                        {garage.website && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Website
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Book Online
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : hasSearched && results.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No garages found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or increasing the search radius
                </p>
                <Button variant="outline" onClick={() => {
                  setFilters({
                    postcode: filters.postcode,
                    radius: 25,
                    serviceType: "All Services",
                    minRating: 0,
                    priceRange: [],
                    certifications: [],
                    openNow: false
                  });
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to find garages?</h3>
                <p className="text-gray-600 mb-4">
                  Enter your postcode and search preferences to find trusted mechanics and service centers near you
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
