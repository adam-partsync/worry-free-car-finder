"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PostcodeInput from "@/components/ui/PostcodeInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Fuel,
  Shield,
  Wrench,
  Car,
  TrendingUp,
  PoundSterling,
  AlertCircle,
  Info
} from "lucide-react";

interface CostCalculation {
  fuel: number;
  insurance: number;
  tax: number;
  mot: number;
  service: number;
  repairs: number;
  depreciation: number;
  total: number;
}

export default function CostCalculator() {
  const [carData, setCarData] = useState({
    make: "",
    model: "",
    year: "",
    engineSize: "",
    fuelType: "petrol",
    annualMileage: "",
    purchasePrice: "",
    mpg: "",
    co2: ""
  });

  const [userProfile, setUserProfile] = useState({
    age: "",
    postcode: "",
    experience: "",
    claims: "0"
  });

  const [calculations, setCalculations] = useState<{
    year1: CostCalculation;
    year2: CostCalculation;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const calculateCosts = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mileage = Number.parseInt(carData.annualMileage) || 12000;
      const mpg = Number.parseFloat(carData.mpg) || 35;
      const purchasePrice = Number.parseFloat(carData.purchasePrice) || 15000;

      // Fuel costs (rough estimates)
      const fuelPricePerLitre = 1.45; // Average UK petrol price
      const litresPerYear = (mileage / mpg) * 4.546; // Convert MPG to litres
      const fuelCostYear1 = litresPerYear * fuelPricePerLitre;
      const fuelCostYear2 = fuelCostYear1 * 1.05; // 5% inflation

      // Insurance estimates based on car value and user profile
      const baseInsurance = Math.max(500, purchasePrice * 0.05);
      const insuranceYear1 = baseInsurance;
      const insuranceYear2 = baseInsurance * 0.95; // Slight decrease with no claims

      // Road tax based on CO2 (simplified)
      const co2 = Number.parseInt(carData.co2) || 150;
      const taxYear1 = co2 > 225 ? 735 : co2 > 150 ? 165 : 0;
      const taxYear2 = taxYear1;

      // MOT and servicing
      const motCost = 54.85; // Official MOT cost
      const serviceCost = 300; // Average service cost

      // Repairs (increases with age)
      const carAge = 2025 - Number.parseInt(carData.year || "2020");
      const repairsCostYear1 = Math.max(200, carAge * 50);
      const repairsCostYear2 = repairsCostYear1 * 1.3;

      // Depreciation (roughly 15-20% per year for used cars)
      const depreciationYear1 = purchasePrice * 0.15;
      const depreciationYear2 = (purchasePrice - depreciationYear1) * 0.15;

      setCalculations({
        year1: {
          fuel: Math.round(fuelCostYear1),
          insurance: Math.round(insuranceYear1),
          tax: taxYear1,
          mot: motCost,
          service: serviceCost,
          repairs: Math.round(repairsCostYear1),
          depreciation: Math.round(depreciationYear1),
          total: Math.round(fuelCostYear1 + insuranceYear1 + taxYear1 + motCost + serviceCost + repairsCostYear1 + depreciationYear1)
        },
        year2: {
          fuel: Math.round(fuelCostYear2),
          insurance: Math.round(insuranceYear2),
          tax: taxYear2,
          mot: motCost,
          service: serviceCost,
          repairs: Math.round(repairsCostYear2),
          depreciation: Math.round(depreciationYear2),
          total: Math.round(fuelCostYear2 + insuranceYear2 + taxYear2 + motCost + serviceCost + repairsCostYear2 + depreciationYear2)
        }
      });

      setLoading(false);
    }, 1500);
  };

  const updateCarData = (field: string, value: string) => {
    setCarData(prev => ({ ...prev, [field]: value }));
  };

  const updateUserProfile = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Car Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Details
          </CardTitle>
          <CardDescription>
            Enter your car's details for accurate cost calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                placeholder="e.g., Toyota"
                value={carData.make}
                onChange={(e) => updateCarData("make", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="e.g., Corolla"
                value={carData.model}
                onChange={(e) => updateCarData("model", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="2020"
                value={carData.year}
                onChange={(e) => updateCarData("year", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engineSize">Engine Size (L)</Label>
              <Input
                id="engineSize"
                placeholder="1.6"
                value={carData.engineSize}
                onChange={(e) => updateCarData("engineSize", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={carData.fuelType} onValueChange={(value) => updateCarData("fuelType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (£)</Label>
              <Input
                id="purchasePrice"
                type="number"
                placeholder="15000"
                value={carData.purchasePrice}
                onChange={(e) => updateCarData("purchasePrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mpg">Fuel Economy (MPG)</Label>
              <Input
                id="mpg"
                type="number"
                placeholder="35"
                value={carData.mpg}
                onChange={(e) => updateCarData("mpg", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="co2">CO2 Emissions (g/km)</Label>
              <Input
                id="co2"
                type="number"
                placeholder="150"
                value={carData.co2}
                onChange={(e) => updateCarData("co2", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualMileage">Annual Mileage</Label>
              <Input
                id="annualMileage"
                type="number"
                placeholder="12000"
                value={carData.annualMileage}
                onChange={(e) => updateCarData("annualMileage", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Profile for Insurance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Profile
          </CardTitle>
          <CardDescription>
            Help us estimate insurance and other personal costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={userProfile.age}
                onChange={(e) => updateUserProfile("age", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <PostcodeInput
                id="postcode"
                value={userProfile.postcode}
                onChange={(value) => updateUserProfile("postcode", value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Driving Experience</Label>
              <Select value={userProfile.experience} onValueChange={(value) => updateUserProfile("experience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="claims">Recent Claims</Label>
              <Select value={userProfile.claims} onValueChange={(value) => updateUserProfile("claims", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No claims</SelectItem>
                  <SelectItem value="1">1 claim</SelectItem>
                  <SelectItem value="2">2 claims</SelectItem>
                  <SelectItem value="3+">3+ claims</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <div className="text-center">
        <Button
          onClick={calculateCosts}
          size="lg"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Calculator className="h-5 w-5 mr-2" />
          {loading ? "Calculating..." : "Calculate Running Costs"}
        </Button>
      </div>

      {/* Results */}
      {calculations && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Running Costs
            </CardTitle>
            <CardDescription>
              Estimated costs for the next 2 years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="year1" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="year1">Year 1</TabsTrigger>
                <TabsTrigger value="year2">Year 2</TabsTrigger>
              </TabsList>

              <TabsContent value="year1" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Fuel className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">£{calculations.year1.fuel}</div>
                    <div className="text-sm text-gray-600">Fuel</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">£{calculations.year1.insurance}</div>
                    <div className="text-sm text-gray-600">Insurance</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <PoundSterling className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">£{calculations.year1.tax}</div>
                    <div className="text-sm text-gray-600">Road Tax</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Wrench className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">£{calculations.year1.service + calculations.year1.mot + calculations.year1.repairs}</div>
                    <div className="text-sm text-gray-600">Maintenance</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    £{calculations.year1.total}
                  </div>
                  <div className="text-lg text-gray-600 mb-2">Total Year 1 Costs</div>
                  <div className="text-sm text-gray-500">
                    £{Math.round(calculations.year1.total / 12)} per month
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="year2" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Fuel className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">£{calculations.year2.fuel}</div>
                    <div className="text-sm text-gray-600">Fuel</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">£{calculations.year2.insurance}</div>
                    <div className="text-sm text-gray-600">Insurance</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <PoundSterling className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">£{calculations.year2.tax}</div>
                    <div className="text-sm text-gray-600">Road Tax</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Wrench className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">£{calculations.year2.service + calculations.year2.mot + calculations.year2.repairs}</div>
                    <div className="text-sm text-gray-600">Maintenance</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    £{calculations.year2.total}
                  </div>
                  <div className="text-lg text-gray-600 mb-2">Total Year 2 Costs</div>
                  <div className="text-sm text-gray-500">
                    £{Math.round(calculations.year2.total / 12)} per month
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <strong>Note:</strong> These are estimates based on average UK costs and your inputs.
                  Actual costs may vary based on your specific circumstances, location, and driving habits.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
