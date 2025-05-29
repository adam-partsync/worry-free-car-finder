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

interface Garage {
  id: string;
  name: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  distance: number;
  priceRange: "£" | "££" | "£££";
  specializations: string[];
  services: string[];
  openingHours: {
    [key: string]: string;
  };
  features: string[];
  description: string;
  established: number;
  certified: string[];
  image: string;
}

interface SearchFilters {
  postcode: string;
  radius: number;
  serviceType: string;
  minRating: number;
  priceRange: string[];
  certifications: string[];
  openNow: boolean;
}

const mockGarages: Garage[] = [
  {
    id: "1",
    name: "AutoCare Plus",
    address: "123 High Street, Kingston upon Thames",
    postcode: "KT1 1AA",
    phone: "020 8546 1234",
    email: "info@autocareplus.co.uk",
    website: "www.autocareplus.co.uk",
    rating: 4.8,
    reviewCount: 127,
    distance: 0.8,
    priceRange: "££",
    specializations: ["BMW", "Mercedes", "Audi", "Volkswagen"],
    services: ["MOT Testing", "Service & Repair", "Diagnostics", "Tyres", "Brakes"],
    openingHours: {
      "Monday": "8:00 AM - 6:00 PM",
      "Tuesday": "8:00 AM - 6:00 PM",
      "Wednesday": "8:00 AM - 6:00 PM",
      "Thursday": "8:00 AM - 6:00 PM",
      "Friday": "8:00 AM - 6:00 PM",
      "Saturday": "8:00 AM - 4:00 PM",
      "Sunday": "Closed"
    },
    features: ["Free Courtesy Car", "24hr Collection", "Online Booking", "Warranty Work"],
    description: "Family-run garage with 25+ years experience specializing in German vehicles. DVSA approved MOT testing station.",
    established: 1998,
    certified: ["DVSA Approved", "Bosch Car Service", "AA Approved"],
    image: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=200&fit=crop"
  },
  {
    id: "2",
    name: "QuickFit Tyres & Service",
    address: "45 London Road, Surbiton",
    postcode: "KT6 7BX",
    phone: "020 8390 5678",
    email: "contact@quickfitservice.co.uk",
    rating: 4.6,
    reviewCount: 89,
    distance: 1.2,
    priceRange: "£",
    specializations: ["Tyres", "Brakes", "Exhaust", "Batteries"],
    services: ["Tyre Fitting", "Wheel Alignment", "Brake Repair", "Exhaust", "Battery"],
    openingHours: {
      "Monday": "7:30 AM - 6:30 PM",
      "Tuesday": "7:30 AM - 6:30 PM",
      "Wednesday": "7:30 AM - 6:30 PM",
      "Thursday": "7:30 AM - 6:30 PM",
      "Friday": "7:30 AM - 6:30 PM",
      "Saturday": "8:00 AM - 5:00 PM",
      "Sunday": "10:00 AM - 4:00 PM"
    },
    features: ["Price Match Guarantee", "Same Day Service", "Mobile Fitting", "Free Health Check"],
    description: "Specialist tyre and fast-fit service center. Competitive prices with price match guarantee.",
    established: 2005,
    certified: ["TyreSafe", "FGAS Certified"],
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop"
  },
  {
    id: "3",
    name: "Heritage Motors",
    address: "78 Portsmouth Road, Thames Ditton",
    postcode: "KT7 0SR",
    phone: "020 8398 9012",
    email: "service@heritagemotors.co.uk",
    website: "www.heritagemotors.co.uk",
    rating: 4.9,
    reviewCount: 203,
    distance: 2.1,
    priceRange: "£££",
    specializations: ["Land Rover", "Jaguar", "Range Rover", "Classic Cars"],
    services: ["Full Service", "MOT Testing", "Diagnostics", "Restoration", "Performance"],
    openingHours: {
      "Monday": "8:00 AM - 5:30 PM",
      "Tuesday": "8:00 AM - 5:30 PM",
      "Wednesday": "8:00 AM - 5:30 PM",
      "Thursday": "8:00 AM - 5:30 PM",
      "Friday": "8:00 AM - 5:30 PM",
      "Saturday": "9:00 AM - 1:00 PM",
      "Sunday": "Closed"
    },
    features: ["Specialist Diagnostics", "Genuine Parts", "Collection Service", "Loan Cars"],
    description: "Premium service center specializing in luxury British vehicles. Authorized service partner.",
    established: 1987,
    certified: ["Land Rover Approved", "Jaguar Authorized", "IMI Certified"],
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=200&fit=crop"
  },
  {
    id: "4",
    name: "TechAuto Diagnostics",
    address: "156 Kingston Road, New Malden",
    postcode: "KT3 3RG",
    phone: "020 8942 3456",
    email: "info@techauodiag.co.uk",
    rating: 4.7,
    reviewCount: 156,
    distance: 1.8,
    priceRange: "££",
    specializations: ["Diagnostics", "ECU Repair", "DPF Cleaning", "Air Con"],
    services: ["Engine Diagnostics", "ECU Programming", "DPF Service", "Air Conditioning", "Electrical"],
    openingHours: {
      "Monday": "9:00 AM - 6:00 PM",
      "Tuesday": "9:00 AM - 6:00 PM",
      "Wednesday": "9:00 AM - 6:00 PM",
      "Thursday": "9:00 AM - 6:00 PM",
      "Friday": "9:00 AM - 6:00 PM",
      "Saturday": "9:00 AM - 3:00 PM",
      "Sunday": "Closed"
    },
    features: ["Latest Diagnostics", "Programming", "DPF Specialist", "Electrical Experts"],
    description: "Specialist in modern vehicle diagnostics and electronic systems. Latest diagnostic equipment.",
    established: 2010,
    certified: ["Bosch Certified", "Launch Approved", "Delphi Trained"],
    image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=200&fit=crop"
  },
  {
    id: "5",
    name: "Green Lane Motors",
    address: "234 Green Lane, Worcester Park",
    postcode: "KT4 8QT",
    phone: "020 8337 7890",
    email: "workshop@greenlane.co.uk",
    rating: 4.4,
    reviewCount: 78,
    distance: 3.2,
    priceRange: "£",
    specializations: ["Ford", "Vauxhall", "Nissan", "Toyota"],
    services: ["General Repair", "MOT Testing", "Service", "Bodywork", "Insurance Work"],
    openingHours: {
      "Monday": "8:00 AM - 5:00 PM",
      "Tuesday": "8:00 AM - 5:00 PM",
      "Wednesday": "8:00 AM - 5:00 PM",
      "Thursday": "8:00 AM - 5:00 PM",
      "Friday": "8:00 AM - 5:00 PM",
      "Saturday": "8:00 AM - 12:00 PM",
      "Sunday": "Closed"
    },
    features: ["Insurance Approved", "Free Estimates", "Local Collection", "Family Run"],
    description: "Local family-run garage serving the community for over 30 years. Honest, reliable service.",
    established: 1992,
    certified: ["DVSA Approved", "Insurance Approved"],
    image: "https://images.unsplash.com/photo-1632823471565-1ecdf4543986?w=400&h=200&fit=crop"
  }
];

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

    // Filter garages based on criteria
    let filteredGarages = [...mockGarages];

    // Filter by service type
    if (filters.serviceType !== "All Services") {
      filteredGarages = filteredGarages.filter(garage =>
        garage.services.includes(filters.serviceType)
      );
    }

    // Filter by rating
    if (filters.minRating > 0) {
      filteredGarages = filteredGarages.filter(garage =>
        garage.rating >= filters.minRating
      );
    }

    // Filter by price range
    if (filters.priceRange.length > 0) {
      filteredGarages = filteredGarages.filter(garage =>
        filters.priceRange.includes(garage.priceRange)
      );
    }

    // Filter by certifications
    if (filters.certifications.length > 0) {
      filteredGarages = filteredGarages.filter(garage =>
        filters.certifications.some(cert => garage.certified.includes(cert))
      );
    }

    // Sort by distance
    filteredGarages.sort((a, b) => a.distance - b.distance);

    setResults(filteredGarages);
    setLoading(false);
  };

  const getPriceRangeText = (range: string) => {
    switch (range) {
      case "£": return "Budget-friendly";
      case "££": return "Mid-range";
      case "£££": return "Premium";
      default: return "";
    }
  };

  const isOpenNow = (hours: { [key: string]: string }) => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = hours[day];

    if (!todayHours || todayHours === "Closed") return false;

    // Simple check - in real implementation would parse actual times
    return true;
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
