"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import PostcodeInput from "@/components/ui/PostcodeInput";
import {
  Shield,
  Car,
  User,
  Calculator,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Phone,
  Globe,
  PoundSterling,
  AlertTriangle,
  Info,
  Filter
} from "lucide-react";

interface DriverDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  licenseHeldYears: number;
  claims: number;
  postcode: string;
}

interface VehicleDetails {
  registration: string;
  make: string;
  model: string;
  year: number;
  value: number;
  annualMileage: number;
  overnightLocation: string;
}

interface CoverageDetails {
  coverType: string;
  excessVoluntary: number;
  coverageStart: string;
  coverageExtras: string[];
}

interface InsuranceQuote {
  id: string;
  provider: string;
  logo: string;
  price: number;
  monthlyPrice: number;
  coverType: string;
  rating: number;
  reviewCount: number;
  excess: number;
  phoneNumber: string;
  website: string;
  features: {
    windscreenCover: boolean;
    breakdown: boolean;
    replacementCar: boolean;
    motorLegalProtection: boolean;
  };
  discounts: string[];
  cashback: number;
}

const mockQuotes: InsuranceQuote[] = [
  {
    id: "1",
    provider: "Direct Line",
    logo: "🏢",
    price: 456,
    monthlyPrice: 42,
    coverType: "Comprehensive",
    rating: 4.2,
    reviewCount: 18743,
    excess: 150,
    phoneNumber: "0345 246 8704",
    website: "directline.com",
    features: {
      windscreenCover: true,
      breakdown: true,
      replacementCar: true,
      motorLegalProtection: true
    },
    discounts: ["Multi-car discount", "Online discount"],
    cashback: 0
  },
  {
    id: "2",
    provider: "Admiral",
    logo: "⚓",
    price: 389,
    monthlyPrice: 36,
    coverType: "Comprehensive",
    rating: 4.5,
    reviewCount: 24561,
    excess: 200,
    phoneNumber: "0333 220 2000",
    website: "admiral.com",
    features: {
      windscreenCover: true,
      breakdown: false,
      replacementCar: true,
      motorLegalProtection: true
    },
    discounts: ["MultiCover", "Named driver"],
    cashback: 25
  },
  {
    id: "3",
    provider: "Aviva",
    logo: "🅰️",
    price: 423,
    monthlyPrice: 39,
    coverType: "Comprehensive",
    rating: 4.0,
    reviewCount: 31247,
    excess: 175,
    phoneNumber: "0800 158 4511",
    website: "aviva.co.uk",
    features: {
      windscreenCover: true,
      breakdown: true,
      replacementCar: true,
      motorLegalProtection: false
    },
    discounts: ["Multi-policy", "Loyalty discount"],
    cashback: 0
  },
  {
    id: "4",
    provider: "LV=",
    logo: "💚",
    price: 368,
    monthlyPrice: 34,
    coverType: "Comprehensive",
    rating: 4.4,
    reviewCount: 16832,
    excess: 150,
    phoneNumber: "0800 202 8000",
    website: "lv.com",
    features: {
      windscreenCover: true,
      breakdown: false,
      replacementCar: true,
      motorLegalProtection: true
    },
    discounts: ["SmartDrive app", "Multi-vehicle"],
    cashback: 50
  },
  {
    id: "5",
    provider: "Churchill",
    logo: "🐕",
    price: 445,
    monthlyPrice: 41,
    coverType: "Comprehensive",
    rating: 4.1,
    reviewCount: 22156,
    excess: 200,
    phoneNumber: "0345 878 6261",
    website: "churchill.com",
    features: {
      windscreenCover: true,
      breakdown: true,
      replacementCar: false,
      motorLegalProtection: true
    },
    discounts: ["Online discount", "Multi-car"],
    cashback: 0
  },
  {
    id: "6",
    provider: "AA Insurance",
    logo: "🛣️",
    price: 512,
    monthlyPrice: 47,
    coverType: "Comprehensive",
    rating: 4.3,
    reviewCount: 15647,
    excess: 175,
    phoneNumber: "0800 107 0680",
    website: "theaa.com",
    features: {
      windscreenCover: true,
      breakdown: true,
      replacementCar: true,
      motorLegalProtection: true
    },
    discounts: ["AA membership", "Multi-vehicle"],
    cashback: 0
  }
];

export default function InsuranceQuoteComparison() {
  const [currentStep, setCurrentStep] = useState(0);
  const [driverDetails, setDriverDetails] = useState<Partial<DriverDetails>>({});
  const [vehicleDetails, setVehicleDetails] = useState<Partial<VehicleDetails>>({});
  const [coverageDetails, setCoverageDetails] = useState<Partial<CoverageDetails>>({});
  const [quotes, setQuotes] = useState<InsuranceQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sortBy, setSortBy] = useState<string>('price');
  const [filterByRating, setFilterByRating] = useState<number>(0);
  const [maxExcess, setMaxExcess] = useState<number>(1000);

  const steps = [
    { title: "Driver Details", description: "About you and your driving history" },
    { title: "Vehicle Information", description: "Details about your car" },
    { title: "Coverage Options", description: "What type of cover you need" },
    { title: "Compare Quotes", description: "See your personalized quotes" }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateQuotes();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateQuotes = async () => {
    setLoading(true);

    try {
      // Simulate API calls to multiple insurance providers
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Apply risk factors to base quotes
      let adjustedQuotes = [...mockQuotes];

      // Age factor
      const birthDate = driverDetails.dateOfBirth || '1990-01-01';
      const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
      const ageFactor = age < 25 ? 1.4 : age > 50 ? 0.9 : 1.0;

      // Experience factor
      const experienceFactor = (driverDetails.licenseHeldYears || 5) < 2 ? 1.3 :
                              (driverDetails.licenseHeldYears || 5) > 10 ? 0.85 : 1.0;

      // Claims factor
      const claimsFactor = 1 + ((driverDetails.claims || 0) * 0.25);

      // Vehicle value factor
      const vehicleValueFactor = (vehicleDetails.value || 15000) > 30000 ? 1.2 :
                                 (vehicleDetails.value || 15000) < 10000 ? 0.9 : 1.0;

      // Postcode factor (simulate regional pricing)
      const postcodeFactor = driverDetails.postcode?.startsWith('M') ? 1.15 :  // Manchester
                            driverDetails.postcode?.startsWith('B') ? 1.12 :   // Birmingham
                            driverDetails.postcode?.startsWith('L') ? 1.18 :   // Liverpool
                            driverDetails.postcode?.startsWith('SW') ? 1.25 :  // London SW
                            driverDetails.postcode?.startsWith('E') ? 1.22 :   // London E
                            0.95; // Rural areas

      adjustedQuotes = adjustedQuotes.map(quote => {
        const adjustedPrice = Math.round(quote.price * ageFactor * experienceFactor * claimsFactor * vehicleValueFactor * postcodeFactor);
        return {
          ...quote,
          price: adjustedPrice,
          monthlyPrice: Math.round(adjustedPrice / 12)
        };
      });

      // Sort by price initially
      adjustedQuotes.sort((a, b) => a.price - b.price);

      setQuotes(adjustedQuotes);
      setLoading(false);
      setShowResults(true);
    } catch (error) {
      console.error('Error generating quotes:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getFilteredAndSortedQuotes = () => {
    const filtered = quotes.filter(quote =>
      quote.rating >= filterByRating && quote.excess <= maxExcess
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'provider':
          return a.provider.localeCompare(b.provider);
        case 'excess':
          return a.excess - b.excess;
        default:
          return 0;
      }
    });
    return filtered;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return driverDetails.firstName && driverDetails.lastName && driverDetails.dateOfBirth &&
               driverDetails.gender && driverDetails.maritalStatus && driverDetails.occupation &&
               driverDetails.postcode;
      case 1:
        return vehicleDetails.make && vehicleDetails.model && vehicleDetails.year &&
               vehicleDetails.value && vehicleDetails.annualMileage && vehicleDetails.overnightLocation;
      case 2:
        return coverageDetails.coverType && coverageDetails.coverageStart;
      default:
        return true;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="py-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Shield className="h-16 w-16 text-blue-600 animate-pulse" />
                <Search className="h-6 w-6 text-green-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Searching for Insurance Quotes...
            </h2>
            <p className="text-gray-600 mb-8">
              We're comparing quotes from leading insurance providers to find you the best deals.
            </p>
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <span>Analyzing your driver profile</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span>Calculating risk factors</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span>Comparing provider rates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results state
  if (showResults) {
    const sortedQuotes = getFilteredAndSortedQuotes();
    const bestDeal = sortedQuotes[0];
    const averagePrice = sortedQuotes.length > 0
      ? Math.round(sortedQuotes.reduce((sum, q) => sum + q.price, 0) / sortedQuotes.length)
      : 0;

    // Savings calculator: estimate savings if user switches from average to best
    const estimatedSavings = averagePrice && bestDeal ? averagePrice - bestDeal.price : 0;

    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Results Header */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
          <CardContent className="text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Shield className="h-16 w-16 text-green-600" />
                <CheckCircle className="h-6 w-6 text-green-500 absolute -bottom-1 -right-1" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Insurance Quotes Are Ready!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              We found {sortedQuotes.length} quotes for your {vehicleDetails.make} {vehicleDetails.model}.
              {sortedQuotes.length > 0 && (
                <>
                  {" "}The best deal could save you {formatCurrency(estimatedSavings)} compared to the average.
                </>
              )}
            </p>
            <div className="flex justify-center gap-4">
              {bestDeal && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-lg px-4 py-2">
                  Best Price: {formatCurrency(bestDeal.price)}
                </Badge>
              )}
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-lg px-4 py-2">
                {sortedQuotes.length} Quotes Compared
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Sorting */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <Label className="text-sm font-medium">Sort by:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="excess">Excess</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Min. Rating:</Label>
                  <Select
                    value={filterByRating.toString()}
                    onValueChange={v => setFilterByRating(Number(v))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="4.2">4.2+</SelectItem>
                      <SelectItem value="4.4">4.4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Max Excess:</Label>
                  <Select
                    value={maxExcess.toString()}
                    onValueChange={v => setMaxExcess(Number(v))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">£1000</SelectItem>
                      <SelectItem value="500">£500</SelectItem>
                      <SelectItem value="250">£250</SelectItem>
                      <SelectItem value="200">£200</SelectItem>
                      <SelectItem value="150">£150</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Showing {sortedQuotes.length} quotes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings Calculator */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calculator className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-900">Savings Calculator</span>
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-center">
                <span className="text-gray-700">
                  Average Quote: <span className="font-bold">{formatCurrency(averagePrice)}</span>
                </span>
                {bestDeal && (
                  <>
                    <span className="text-gray-700">
                      Best Quote: <span className="font-bold">{formatCurrency(bestDeal.price)}</span>
                    </span>
                    <span className="text-green-700 font-semibold">
                      You could save {formatCurrency(estimatedSavings)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Results */}
        <div className="space-y-6">
          {sortedQuotes.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  <div className="text-lg font-semibold text-gray-800">No quotes match your filters.</div>
                  <div className="text-gray-600">Try adjusting your filters above to see more results.</div>
                </div>
              </CardContent>
            </Card>
          )}
          {sortedQuotes.map((quote, index) => (
            <Card key={quote.id} className={`overflow-hidden ${index === 0 ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-lg'} transition-all`}>
              {index === 0 && (
                <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
                  ⭐ BEST DEAL - RECOMMENDED
                </div>
              )}
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Provider Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{quote.logo}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{quote.provider}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium ml-1">{quote.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">({quote.reviewCount.toLocaleString()} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="lg:col-span-1 text-center lg:text-left">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {formatCurrency(quote.price)}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      or {formatCurrency(quote.monthlyPrice)}/month
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Excess: {formatCurrency(quote.excess)}
                    </div>
                    {quote.cashback > 0 && (
                      <Badge className="bg-orange-100 text-orange-800 mb-2">
                        {formatCurrency(quote.cashback)} Cashback
                      </Badge>
                    )}
                    {index === 0 && (
                      <Badge className="bg-green-100 text-green-800 block mb-2">
                        Save {formatCurrency(estimatedSavings)}
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="lg:col-span-1">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <div className="flex items-center gap-1">
                        {quote.features.windscreenCover ? <CheckCircle className="h-3 w-3 text-green-600" /> : <AlertTriangle className="h-3 w-3 text-gray-400" />}
                        <span className={quote.features.windscreenCover ? 'text-gray-700' : 'text-gray-400'}>Windscreen</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {quote.features.breakdown ? <CheckCircle className="h-3 w-3 text-green-600" /> : <AlertTriangle className="h-3 w-3 text-gray-400" />}
                        <span className={quote.features.breakdown ? 'text-gray-700' : 'text-gray-400'}>Breakdown</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {quote.features.replacementCar ? <CheckCircle className="h-3 w-3 text-green-600" /> : <AlertTriangle className="h-3 w-3 text-gray-400" />}
                        <span className={quote.features.replacementCar ? 'text-gray-700' : 'text-gray-400'}>Courtesy Car</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {quote.features.motorLegalProtection ? <CheckCircle className="h-3 w-3 text-green-600" /> : <AlertTriangle className="h-3 w-3 text-gray-400" />}
                        <span className={quote.features.motorLegalProtection ? 'text-gray-700' : 'text-gray-400'}>Legal Cover</span>
                      </div>
                    </div>

                    {/* Value Score */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-600 mb-1">Value Score:</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 h-2 rounded-full"
                            style={{
                              width: `${Math.max(20, 100 - ((quote.price - sortedQuotes[0]?.price || 0) / 100))}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {index === 0 ? 'Excellent' : index === 1 ? 'Very Good' : index === 2 ? 'Good' : 'Fair'}
                        </span>
                      </div>
                    </div>

                    {quote.discounts.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-600 mb-1">Available Discounts:</div>
                        <div className="flex flex-wrap gap-1">
                          {quote.discounts.slice(0, 2).map(discount => (
                            <Badge key={discount} variant="outline" className="text-xs">
                              {discount}
                            </Badge>
                          ))}
                          {quote.discounts.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{quote.discounts.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1 flex flex-col gap-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Shield className="h-4 w-4 mr-2" />
                      Get This Quote
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call {quote.phoneNumber}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit {quote.website}
                    </Button>

                    {/* Additional Info */}
                    <div className="text-xs text-gray-600 mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Processing time:</span>
                        <span className="font-medium">2-5 mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Policy documents:</span>
                        <span className="font-medium">Email + Post</span>
                      </div>
                      {quote.cashback > 0 && (
                        <div className="flex justify-between text-orange-600">
                          <span>Cashback offer:</span>
                          <span className="font-medium">{formatCurrency(quote.cashback)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-3">Tips for Choosing Insurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium mb-2">Price vs Coverage</h4>
                    <ul className="space-y-1">
                      <li>• Don't just choose the cheapest option</li>
                      <li>• Check what's included in the price</li>
                      <li>• Consider the excess you'll pay for claims</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Provider Reliability</h4>
                    <ul className="space-y-1">
                      <li>• Check customer service ratings</li>
                      <li>• Read reviews about claims handling</li>
                      <li>• Look for industry awards and recognition</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Need Help Choosing?</h3>
                <p className="text-blue-100">Our insurance experts can help you find the perfect policy</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Phone className="h-4 w-4 mr-2" />
                  Speak to Expert
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" onClick={() => {
                  setCurrentStep(0);
                  setShowResults(false);
                  setQuotes([]);
                  setDriverDetails({});
                  setVehicleDetails({});
                  setCoverageDetails({});
                }}>
                  <Search className="h-4 w-4 mr-2" />
                  Get New Quotes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form interface
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          Insurance Quote Comparison
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Compare quotes from leading UK insurance providers. Get the best deal with comprehensive
          coverage that fits your needs and budget.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {steps.map((step, index) => (
            <span key={index} className={index <= currentStep ? 'text-blue-600 font-medium' : ''}>
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 0 && <User className="h-5 w-5 text-blue-600" />}
            {currentStep === 1 && <Car className="h-5 w-5 text-blue-600" />}
            {currentStep === 2 && <Shield className="h-5 w-5 text-blue-600" />}
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 0: Driver Details */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={driverDetails.firstName || ''}
                  onChange={(e) => setDriverDetails(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={driverDetails.lastName || ''}
                  onChange={(e) => setDriverDetails(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={driverDetails.dateOfBirth || ''}
                  onChange={(e) => setDriverDetails(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select onValueChange={(value) => setDriverDetails(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Marital Status *</Label>
                <Select onValueChange={(value) => setDriverDetails(prev => ({ ...prev, maritalStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="civil_partnership">Civil Partnership</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Occupation *</Label>
                <Select onValueChange={(value) => setDriverDetails(prev => ({ ...prev, occupation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="homemaker">Homemaker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Years Held License *</Label>
                <Select onValueChange={(value) => setDriverDetails(prev => ({ ...prev, licenseHeldYears: Number.parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Less than 1 year</SelectItem>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Claims in Last 5 Years</Label>
                <Select onValueChange={(value) => setDriverDetails(prev => ({ ...prev, claims: Number.parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Number of claims" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="1">1 claim</SelectItem>
                    <SelectItem value="2">2 claims</SelectItem>
                    <SelectItem value="3">3+ claims</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <PostcodeInput
                  id="postcode"
                  value={driverDetails.postcode || ''}
                  onChange={(value) => setDriverDetails(prev => ({ ...prev, postcode: value }))}
                />
              </div>
            </div>
          )}

          {/* Step 1: Vehicle Details */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="registration">Vehicle Registration (Optional)</Label>
                <Input
                  id="registration"
                  placeholder="e.g. AB12 CDE"
                  value={vehicleDetails.registration || ''}
                  onChange={(e) => setVehicleDetails(prev => ({ ...prev, registration: e.target.value.toUpperCase() }))}
                />
                <p className="text-sm text-gray-600">Leave blank to enter details manually</p>
              </div>
              <div className="space-y-2">
                <Label>Make *</Label>
                <Select onValueChange={(value) => setVehicleDetails(prev => ({ ...prev, make: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="audi">Audi</SelectItem>
                    <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                    <SelectItem value="volkswagen">Volkswagen</SelectItem>
                    <SelectItem value="ford">Ford</SelectItem>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="vauxhall">Vauxhall</SelectItem>
                    <SelectItem value="nissan">Nissan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g. 3 Series"
                  value={vehicleDetails.model || ''}
                  onChange={(e) => setVehicleDetails(prev => ({ ...prev, model: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Year *</Label>
                <Select onValueChange={(value) => setVehicleDetails(prev => ({ ...prev, year: Number.parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Vehicle Value (£) *</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="e.g. 15000"
                  value={vehicleDetails.value || ''}
                  onChange={(e) => setVehicleDetails(prev => ({ ...prev, value: Number.parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualMileage">Annual Mileage *</Label>
                <Select onValueChange={(value) => setVehicleDetails(prev => ({ ...prev, annualMileage: Number.parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mileage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5000">Under 5,000 miles</SelectItem>
                    <SelectItem value="8000">5,000 - 8,000 miles</SelectItem>
                    <SelectItem value="12000">8,000 - 12,000 miles</SelectItem>
                    <SelectItem value="15000">12,000 - 15,000 miles</SelectItem>
                    <SelectItem value="20000">15,000 - 20,000 miles</SelectItem>
                    <SelectItem value="25000">Over 20,000 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Overnight Parking *</Label>
                <Select onValueChange={(value) => setVehicleDetails(prev => ({ ...prev, overnightLocation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Where is it parked?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="garage">Garage</SelectItem>
                    <SelectItem value="driveway">Driveway</SelectItem>
                    <SelectItem value="street">On street</SelectItem>
                    <SelectItem value="car_park">Car park</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Coverage Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Type of Cover *</Label>
                <RadioGroup
                  onValueChange={(value) => setCoverageDetails(prev => ({ ...prev, coverType: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="comprehensive" id="comprehensive" />
                    <Label htmlFor="comprehensive" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Comprehensive</div>
                      <div className="text-sm text-gray-600">
                        Full protection including theft, vandalism, and accidental damage
                      </div>
                    </Label>
                    <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="third_party_fire_theft" id="third_party_fire_theft" />
                    <Label htmlFor="third_party_fire_theft" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Third Party, Fire & Theft</div>
                      <div className="text-sm text-gray-600">
                        Covers damage to other vehicles plus fire and theft of your car
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="third_party_only" id="third_party_only" />
                    <Label htmlFor="third_party_only" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Third Party Only</div>
                      <div className="text-sm text-gray-600">
                        Basic legal requirement - covers damage to other vehicles only
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="coverageStart">Cover Start Date *</Label>
                  <Input
                    id="coverageStart"
                    type="date"
                    value={coverageDetails.coverageStart || ''}
                    onChange={(e) => setCoverageDetails(prev => ({ ...prev, coverageStart: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Voluntary Excess</Label>
                  <Select onValueChange={(value) => setCoverageDetails(prev => ({ ...prev, excessVoluntary: Number.parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select excess" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">£0 (Higher premium)</SelectItem>
                      <SelectItem value="100">£100</SelectItem>
                      <SelectItem value="250">£250</SelectItem>
                      <SelectItem value="500">£500</SelectItem>
                      <SelectItem value="1000">£1000 (Lower premium)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Additional Coverage (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'breakdown', label: 'Breakdown Cover', description: 'Roadside assistance and recovery' },
                    { id: 'legal', label: 'Motor Legal Protection', description: 'Legal costs for uninsured losses' },
                    { id: 'key', label: 'Key Cover', description: 'Replacement keys and locks' },
                    { id: 'personal', label: 'Personal Belongings', description: 'Cover for items in your car' }
                  ].map(extra => (
                    <div key={extra.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={extra.id}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCoverageDetails(prev => ({
                              ...prev,
                              coverageExtras: [...(prev.coverageExtras || []), extra.id]
                            }));
                          } else {
                            setCoverageDetails(prev => ({
                              ...prev,
                              coverageExtras: (prev.coverageExtras || []).filter(e => e !== extra.id)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={extra.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{extra.label}</div>
                        <div className="text-sm text-gray-600">{extra.description}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={nextStep}
          disabled={!canProceed()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {currentStep === steps.length - 1 ? (
            <>
              Get Quotes
              <Calculator className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
