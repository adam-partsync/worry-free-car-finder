"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Truck,
  Calculator,
  Car,
  AlertTriangle,
  CheckCircle,
  Info,
  Search,
  Weight,
  Gauge,
  Route,
  Shield,
  BookOpen,
  Target,
  Zap,
  TrendingUp
} from "lucide-react";

interface TowingCalculation {
  trailerWeight: number;
  cargoWeight: number;
  totalWeight: number;
  recommendedCapacity: number;
  safetyMargin: number;
  isWithinLimits: boolean;
  warnings: string[];
  recommendations: string[];
}

interface VehicleRecommendation { // This is the component's interface
  make: string;
  model: string;
  year: string; // From ApiTowingVehicle.year
  towingCapacity: number; // From ApiTowingVehicle.towingCapacity
  price: string; // From ApiTowingVehicle.priceRange
  fuelType: string; // From ApiTowingVehicle.fuelType, ensure default if undefined
  bodyType: string; // From ApiTowingVehicle.bodyType, ensure default if undefined
  features: string[]; // This was in the old interface, ApiTowingVehicle doesn't have a direct 'features' array. Map from other fields or set to empty array. Consider if `engineDetails` or other info from `ApiTowingVehicle` should be part of features.
  pros: string[]; // From ApiTowingVehicle.pros, ensure default like []
  cons: string[]; // From ApiTowingVehicle.cons, ensure default like []
  image: string; // From ApiTowingVehicle.imageUrl, ensure default placeholder if undefined
  suitability: 'excellent' | 'good' | 'fair' | string; // From ApiTowingVehicle.suitability, ensure default
  // Add engineDetails if you want to display it directly
  engineDetails?: string; // From ApiTowingVehicle.engineDetails
}


interface TowingGuide {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tips: string[];
  warnings: string[];
  requirements: string[];
}

// For reference, not used directly in component:
// interface ApiTowingVehicle {
//   id: string;
//   make: string;
//   model: string;
//   year: string; // Or number
//   towingCapacity: number;
//   priceRange: string; // e.g., "£35,000 - £45,000"
//   fuelType?: string;
//   bodyType?: string;
//   engineDetails?: string;
//   imageUrl?: string;
//   pros?: string[];
//   cons?: string[];
//   suitability?: 'excellent' | 'good' | 'fair' | string; // For towing
// }

export default function TowingGuide() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [trailerWeight, setTrailerWeight] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [towingCalculation, setTowingCalculation] = useState<TowingCalculation | null>(null);
  const [towingNeed, setTowingNeed] = useState(""); // For the select dropdown
  const [budget, setBudget] = useState(""); // For the select dropdown
  const [fuelPreference, setFuelPreference] = useState(""); // For the select dropdown
  
  const [recommendations, setRecommendations] = useState<VehicleRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);


  // Mock towing guides data - remains as static content
  const towingGuides: TowingGuide[] = [
    {
      id: "1",
      title: "Understanding Towing Capacity",
      category: "Basics",
      description: "Learn about gross vehicle weight, payload, and towing limits",
      content: "Towing capacity is the maximum weight your vehicle can safely tow. It's determined by your vehicle's gross vehicle weight rating (GVWR), gross combined weight rating (GCWR), and payload capacity.",
      tips: [
        "Never exceed your vehicle's maximum towing capacity",
        "Account for passengers and cargo in your vehicle",
        "Use a 10-15% safety margin for peace of mind",
        "Check your vehicle's handbook for exact specifications"
      ],
      warnings: [
        "Exceeding towing limits can damage your vehicle",
        "Insurance may be void if you exceed weight limits",
        "Stopping distances increase significantly when towing"
      ],
      requirements: [
        "Valid driving license (Category B+E for heavy trailers)",
        "Properly fitted towbar",
        "Correct electrical connections",
        "Appropriate mirrors and lighting"
      ]
    },
    {
      id: "2",
      title: "Choosing the Right Towbar",
      category: "Equipment",
      description: "Fixed, detachable, and swan neck towbars explained",
      content: "There are three main types of towbars: fixed (permanent), detachable (removable), and swan neck (curved design). Each has different benefits depending on your needs.",
      tips: [
        "Swan neck towbars don't obscure number plates",
        "Detachable towbars maintain vehicle aesthetics",
        "Fixed towbars are the most cost-effective option",
        "Professional installation is highly recommended"
      ],
      warnings: [
        "DIY installation may void vehicle warranty",
        "Incorrect fitting can be dangerous",
        "Cheap towbars may not meet safety standards"
      ],
      requirements: [
        "Type approval certification",
        "Correct weight rating for your needs",
        "Vehicle-specific fitting kit",
        "Professional installation certificate"
      ]
    },
    {
      id: "3",
      title: "Legal Requirements for Towing",
      category: "Legal",
      description: "UK laws, licensing, and regulations for towing",
      content: "UK towing laws depend on your license date, trailer weight, and combination weight. Modern licenses (post-1997) have different restrictions than older licenses.",
      tips: [
        "Check your license category entitlements",
        "Ensure trailer is properly registered if over 750kg",
        "Use correct number plates on trailer",
        "Maintain appropriate insurance cover"
      ],
      warnings: [
        "Driving without correct license is illegal",
        "Unregistered heavy trailers face penalties",
        "Inadequate insurance could void cover"
      ],
      requirements: [
        "Category B license for trailers up to 750kg",
        "Category B+E for heavier trailer combinations",
        "Trailer registration for trailers over 750kg",
        "Appropriate insurance coverage"
      ]
    }
  ];

  const calculateTowing = () => {
    const trailer = Number(trailerWeight);
    const cargo = Number(cargoWeight);
    const total = trailer + cargo;
    const recommended = Math.ceil(total * 1.15); // 15% safety margin
    const safetyMargin = (recommended - total) / total * 100;

    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (total > 3500) {
      warnings.push("Total weight exceeds most car towing limits - consider a commercial vehicle");
    }
    if (total > 750) {
      warnings.push("You may need Category B+E license for this weight");
      recommendations.push("Check your driving license category");
    }
    if (safetyMargin < 10) {
      warnings.push("Safety margin is quite low - consider a higher capacity vehicle");
    }

    recommendations.push("Ensure your vehicle's GVWR can handle the total combination weight");
    recommendations.push("Consider professional towbar installation");
    recommendations.push("Practice towing in a safe area before long journeys");

    const calculation: TowingCalculation = {
      trailerWeight: trailer,
      cargoWeight: cargo,
      totalWeight: total,
      recommendedCapacity: recommended,
      safetyMargin,
      isWithinLimits: total <= 3500,
      warnings,
      recommendations
    };

    setTowingCalculation(calculation);
  };

  const getVehicleRecommendations = () => {

  const getSuitabilityBadge = (suitability: string) => {
    switch (suitability) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'fair':
        return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
      default:
        return <Badge variant="outline">{suitability}</Badge>;
    }
  };

  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case 'excellent':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good':
        return <Target className="h-5 w-5 text-blue-600" />;
      case 'fair':
        return <Info className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Truck className="h-8 w-8 text-blue-600" />
          Towing Guide & Vehicle Finder
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find the perfect car or van for your towing needs. Calculate towing requirements,
          get vehicle recommendations, and learn about towing safely and legally.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Towing Calculator</TabsTrigger>
          <TabsTrigger value="recommendations">Vehicle Finder</TabsTrigger>
          <TabsTrigger value="guides">Towing Guides</TabsTrigger>
          <TabsTrigger value="legal">Legal & Safety</TabsTrigger>
        </TabsList>

        {/* Towing Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Towing Capacity Calculator
              </CardTitle>
              <CardDescription>
                Calculate the minimum towing capacity you need for your trailer and cargo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trailerWeight">Trailer Weight (kg)</Label>
                  <Input
                    id="trailerWeight"
                    type="number"
                    placeholder="e.g., 800"
                    value={trailerWeight}
                    onChange={(e) => setTrailerWeight(e.target.value)}
                  />
                  <p className="text-sm text-gray-600 mt-1">Empty weight of your trailer/caravan</p>
                </div>
                <div>
                  <Label htmlFor="cargoWeight">Cargo Weight (kg)</Label>
                  <Input
                    id="cargoWeight"
                    type="number"
                    placeholder="e.g., 300"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(e.target.value)}
                  />
                  <p className="text-sm text-gray-600 mt-1">Weight of items you'll carry in the trailer</p>
                </div>
              </div>

              <Button onClick={calculateTowing} disabled={!trailerWeight || !cargoWeight}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Towing Requirements
              </Button>

              {towingCalculation && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Weight className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{towingCalculation.totalWeight}kg</p>
                        <p className="text-sm text-gray-600">Total Towing Weight</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Gauge className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{towingCalculation.recommendedCapacity}kg</p>
                        <p className="text-sm text-gray-600">Recommended Capacity</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{Math.round(towingCalculation.safetyMargin)}%</p>
                        <p className="text-sm text-gray-600">Safety Margin</p>
                      </CardContent>
                    </Card>
                  </div>

                  {towingCalculation.warnings.length > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>Important Warnings:</strong>
                        <ul className="list-disc list-inside mt-2">
                          {towingCalculation.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Recommendations:</strong>
                      <ul className="list-disc list-inside mt-2">
                        {towingCalculation.recommendations.map((recommendation, index) => (
                          <li key={index}>{recommendation}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Button onClick={() => setActiveTab("recommendations")} className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Find Suitable Vehicles
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle Finder Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Finder
              </CardTitle>
              <CardDescription>
                Find cars and vans suitable for your towing needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="towingNeed">Towing Requirement</Label>
                  <Select value={towingNeed} onValueChange={setTowingNeed}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your needs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small-trailer">Small Trailer (up to 750kg)</SelectItem>
                      <SelectItem value="caravan">Caravan (750kg - 1500kg)</SelectItem>
                      <SelectItem value="large-caravan">Large Caravan (1500kg - 2500kg)</SelectItem>
                      <SelectItem value="horsebox">Horsebox/Large Trailer (2500kg+)</SelectItem>
                      <SelectItem value="boat">Boat Trailer</SelectItem>
                      <SelectItem value="business">Business/Commercial Towing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={budget} onValueChange={setBudget}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-30k">Under £30,000</SelectItem>
                      <SelectItem value="30k-50k">£30,000 - £50,000</SelectItem>
                      <SelectItem value="50k-70k">£50,000 - £70,000</SelectItem>
                      <SelectItem value="over-70k">Over £70,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fuelPreference">Fuel Type</Label>
                  <Select value={fuelPreference} onValueChange={setFuelPreference}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Fuel Type</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={getVehicleRecommendations}>
                <Search className="h-4 w-4 mr-2" />
                Find Suitable Vehicles
              </Button>
            </CardContent>
          </Card>

          {/* Vehicle Recommendations */}
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((vehicle, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h3>
                          <p className="text-gray-600">{vehicle.year} • {vehicle.fuelType} • {vehicle.bodyType}</p>
                          <p className="text-lg font-semibold text-blue-600 mt-1">{vehicle.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSuitabilityIcon(vehicle.suitability)}
                          {getSuitabilityBadge(vehicle.suitability)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">✅ Pros:</h4>
                          <ul className="text-sm space-y-1">
                            {vehicle.pros.map((pro, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">⚠️ Cons:</h4>
                          <ul className="text-sm space-y-1">
                            {vehicle.cons.map((con, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="font-bold text-lg">{vehicle.towingCapacity}kg</p>
                            <p className="text-xs text-gray-600">Max Towing</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {vehicle.features.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline">
                          <Search className="h-4 w-4 mr-2" />
                          Find This Model
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to Find Your Towing Vehicle?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Select your requirements above to get personalized vehicle recommendations
                    for your towing needs.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Towing Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <div className="space-y-4">
            {towingGuides.map((guide) => (
              <Card key={guide.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{guide.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{guide.content}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">💡 Tips:</h4>
                      <ul className="space-y-1">
                        {guide.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-1" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">⚠️ Warnings:</h4>
                      <ul className="space-y-1">
                        {guide.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-3 w-3 text-red-600 mt-1" />
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">📋 Requirements:</h4>
                      <ul className="space-y-1">
                        {guide.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Info className="h-3 w-3 text-blue-600 mt-1" />
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Legal & Safety Tab */}
        <TabsContent value="legal" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  UK Towing Laws
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">License Requirements</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span><strong>Category B:</strong> Trailers up to 750kg</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span><strong>Category B+E:</strong> Heavier trailer combinations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Info className="h-3 w-3 text-blue-600" />
                      <span>Pre-1997 licenses have different entitlements</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Weight Limits</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Car + Trailer:</strong> Maximum 3,500kg total (Category B)</li>
                    <li><strong>Speed Limits:</strong> Reduced when towing</li>
                    <li><strong>Motorways:</strong> 60mph max with trailer</li>
                    <li><strong>Dual Carriageways:</strong> 60mph max with trailer</li>
                    <li><strong>Single Carriageways:</strong> 50mph max with trailer</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-green-600" />
                  Safety Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Before Towing</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Check tire pressures (car and trailer)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Verify electrical connections work
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Ensure trailer is level and balanced
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Check mirrors provide clear view
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">While Towing</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Allow extra stopping distance</strong></li>
                    <li><strong>Take wider turns</strong> at junctions</li>
                    <li><strong>Use lower gears</strong> on hills</li>
                    <li><strong>Check trailer regularly</strong> during long journeys</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Important:</strong> This guide provides general information about UK towing laws and safety.
              Always consult official DVLA guidance and consider professional training for inexperienced towers.
              Laws and regulations may change, so verify current requirements before towing.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}
