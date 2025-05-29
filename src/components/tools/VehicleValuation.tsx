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
  TrendingDown,
  TrendingUp,
  Calculator,
  Car,
  Calendar,
  Gauge,
  Star,
  Info,
  PoundSterling,
  BarChart3,
  Activity
} from "lucide-react";

interface ValuationResult {
  currentValue: {
    retail: number;
    private: number;
    tradeIn: number;
  };
  depreciation: {
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
  };
  marketData: {
    demandLevel: 'Low' | 'Medium' | 'High';
    supplyLevel: 'Low' | 'Medium' | 'High';
    marketTrend: 'Declining' | 'Stable' | 'Rising';
    popularityScore: number;
  };
  factors: {
    age: number;
    mileage: number;
    condition: number;
    serviceHistory: number;
    modifications: number;
    accidents: number;
  };
  similarVehicles: Array<{
    make: string;
    model: string;
    year: number;
    mileage: number;
    price: number;
    location: string;
  }>;
}

export default function VehicleValuation() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("lookup");
  const [registrationLookup, setRegistrationLookup] = useState("");
  const [manualInput, setManualInput] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: "",
    condition: "good",
    serviceHistory: "full",
    modifications: "none",
    accidents: "none"
  });
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);

  // Mock valuation calculation
  const calculateValuation = async (isRegistrationLookup = false) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock data based on input
    const baseValue = isRegistrationLookup ? 18000 : 15000;
    const ageAdjustment = isRegistrationLookup ? 0.9 : 0.85;
    const mileageAdjustment = 0.95;
    const conditionMultiplier = manualInput.condition === 'excellent' ? 1.1 :
                               manualInput.condition === 'good' ? 1.0 :
                               manualInput.condition === 'fair' ? 0.9 : 0.8;

    const adjustedValue = baseValue * ageAdjustment * mileageAdjustment * conditionMultiplier;

    const result: ValuationResult = {
      currentValue: {
        retail: Math.round(adjustedValue * 1.15),
        private: Math.round(adjustedValue),
        tradeIn: Math.round(adjustedValue * 0.85)
      },
      depreciation: {
        year1: Math.round(adjustedValue * 0.85),
        year2: Math.round(adjustedValue * 0.72),
        year3: Math.round(adjustedValue * 0.62),
        year4: Math.round(adjustedValue * 0.54),
        year5: Math.round(adjustedValue * 0.47)
      },
      marketData: {
        demandLevel: 'High',
        supplyLevel: 'Medium',
        marketTrend: 'Stable',
        popularityScore: 8.5
      },
      factors: {
        age: 85,
        mileage: 90,
        condition: manualInput.condition === 'excellent' ? 95 :
                  manualInput.condition === 'good' ? 85 :
                  manualInput.condition === 'fair' ? 70 : 55,
        serviceHistory: manualInput.serviceHistory === 'full' ? 95 :
                       manualInput.serviceHistory === 'partial' ? 80 : 60,
        modifications: manualInput.modifications === 'none' ? 100 :
                      manualInput.modifications === 'tasteful' ? 105 : 80,
        accidents: manualInput.accidents === 'none' ? 100 :
                  manualInput.accidents === 'minor' ? 85 : 65
      },
      similarVehicles: [
        { make: "Toyota", model: "Corolla", year: 2020, mileage: 35000, price: 16500, location: "London" },
        { make: "Toyota", model: "Corolla", year: 2019, mileage: 42000, price: 15200, location: "Birmingham" },
        { make: "Toyota", model: "Corolla", year: 2021, mileage: 28000, price: 17800, location: "Manchester" },
        { make: "Toyota", model: "Corolla", year: 2020, mileage: 41000, price: 15800, location: "Bristol" }
      ]
    };

    setValuationResult(result);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getFactorColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getFactorBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Rising':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'Declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars ? 'text-yellow-400 fill-current' :
              i === fullStars && halfStar ? 'text-yellow-400 fill-current' :
              'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}/10</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Calculator className="h-8 w-8 text-blue-600" />
          Vehicle Valuation Tool
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get an accurate valuation of your vehicle with depreciation forecasting and market analysis.
          Compare retail, private sale, and trade-in values.
        </p>
      </div>

      {/* Input Methods */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lookup">Registration Lookup</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        {/* Registration Lookup */}
        <TabsContent value="lookup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Quick Registration Lookup
              </CardTitle>
              <CardDescription>
                Enter your vehicle registration for instant valuation based on DVLA data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="registration">Vehicle Registration</Label>
                  <Input
                    id="registration"
                    placeholder="e.g., AB12 CDE"
                    value={registrationLookup}
                    onChange={(e) => setRegistrationLookup(e.target.value.toUpperCase())}
                    maxLength={8}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => calculateValuation(true)}
                    disabled={!registrationLookup.trim() || loading}
                    className="px-8"
                  >
                    {loading ? 'Calculating...' : 'Get Valuation'}
                  </Button>
                </div>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  We'll automatically fetch vehicle details from DVLA records and provide an instant valuation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Entry */}
        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Manual Vehicle Details
              </CardTitle>
              <CardDescription>
                Enter your vehicle details manually for a detailed valuation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Toyota"
                    value={manualInput.make}
                    onChange={(e) => setManualInput(prev => ({ ...prev, make: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Corolla"
                    value={manualInput.model}
                    onChange={(e) => setManualInput(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={manualInput.year}
                    onChange={(e) => setManualInput(prev => ({ ...prev, year: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="e.g., 45000"
                    value={manualInput.mileage}
                    onChange={(e) => setManualInput(prev => ({ ...prev, mileage: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Overall Condition</Label>
                  <Select value={manualInput.condition} onValueChange={(value) => setManualInput(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="serviceHistory">Service History</Label>
                  <Select value={manualInput.serviceHistory} onValueChange={(value) => setManualInput(prev => ({ ...prev, serviceHistory: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Service History</SelectItem>
                      <SelectItem value="partial">Partial Service History</SelectItem>
                      <SelectItem value="none">No Service History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="modifications">Modifications</Label>
                  <Select value={manualInput.modifications} onValueChange={(value) => setManualInput(prev => ({ ...prev, modifications: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Modifications</SelectItem>
                      <SelectItem value="tasteful">Tasteful Modifications</SelectItem>
                      <SelectItem value="extensive">Extensive Modifications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accidents">Accident History</Label>
                  <Select value={manualInput.accidents} onValueChange={(value) => setManualInput(prev => ({ ...prev, accidents: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Accidents</SelectItem>
                      <SelectItem value="minor">Minor Accident</SelectItem>
                      <SelectItem value="major">Major Accident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => calculateValuation(false)}
                  disabled={!manualInput.make || !manualInput.model || !manualInput.mileage || loading}
                  className="px-8"
                >
                  {loading ? 'Calculating...' : 'Calculate Valuation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results */}
      {valuationResult && (
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current Value</TabsTrigger>
            <TabsTrigger value="forecast">Depreciation Forecast</TabsTrigger>
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
            <TabsTrigger value="factors">Valuation Factors</TabsTrigger>
          </TabsList>

          {/* Current Value Tab */}
          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PoundSterling className="h-5 w-5 text-blue-600" />
                    Retail Value
                  </CardTitle>
                  <CardDescription>Dealer/showroom price</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(valuationResult.currentValue.retail)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    What you'd expect to pay at a dealer
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PoundSterling className="h-5 w-5 text-green-600" />
                    Private Sale Value
                  </CardTitle>
                  <CardDescription>Private party selling price</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(valuationResult.currentValue.private)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    What you could sell for privately
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PoundSterling className="h-5 w-5 text-orange-600" />
                    Trade-in Value
                  </CardTitle>
                  <CardDescription>Dealer trade-in offer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600">
                    {formatCurrency(valuationResult.currentValue.tradeIn)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    What a dealer would offer in trade
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Similar Vehicles */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Vehicles For Sale</CardTitle>
                <CardDescription>Compare with similar vehicles currently on the market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {valuationResult.similarVehicles.map((vehicle, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                        <p className="text-sm text-gray-600">
                          {vehicle.year} • {vehicle.mileage.toLocaleString()} miles • {vehicle.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(vehicle.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Depreciation Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  5-Year Depreciation Forecast
                </CardTitle>
                <CardDescription>
                  Projected values based on typical depreciation patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Object.entries(valuationResult.depreciation).map(([year, value], index) => (
                      <Card key={year}>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-600 mb-1">Year {index + 1}</p>
                          <p className="text-xl font-bold">{formatCurrency(value)}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(((valuationResult.currentValue.private - value) / valuationResult.currentValue.private) * 100)}% loss
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Depreciation forecasts are estimates based on historical data and market trends.
                      Actual values may vary depending on market conditions, vehicle condition, and other factors.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Analysis Tab */}
          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Demand Level:</span>
                    <Badge className={
                      valuationResult.marketData.demandLevel === 'High' ? 'bg-green-100 text-green-800' :
                      valuationResult.marketData.demandLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {valuationResult.marketData.demandLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Supply Level:</span>
                    <Badge className={
                      valuationResult.marketData.supplyLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      valuationResult.marketData.supplyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {valuationResult.marketData.supplyLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Market Trend:</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(valuationResult.marketData.marketTrend)}
                      <span>{valuationResult.marketData.marketTrend}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popularity Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600 mb-2">
                      {valuationResult.marketData.popularityScore}/10
                    </p>
                    {renderStars(valuationResult.marketData.popularityScore)}
                    <p className="text-sm text-gray-600 mt-3">
                      Based on search volume, sales data, and consumer interest
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Strong demand:</strong> This model is popular in the current market with good resale potential.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Activity className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Stable pricing:</strong> Values have remained consistent over the past 6 months.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Star className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Best selling time:</strong> Spring and early summer typically see higher prices for this model.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Valuation Factors Tab */}
          <TabsContent value="factors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Factors Affecting Your Valuation</CardTitle>
                <CardDescription>
                  How different aspects of your vehicle impact its value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(valuationResult.factors).map(([factor, score]) => (
                    <div key={factor} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="capitalize font-medium">{factor.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="flex-1">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                score >= 90 ? 'bg-green-500' :
                                score >= 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${getFactorColor(score)}`}>
                          {score}%
                        </span>
                        {getFactorBadge(score)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {valuationResult.factors.serviceHistory < 90 && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Service History:</strong> A complete service history could increase your vehicle's value by up to £500.
                      </AlertDescription>
                    </Alert>
                  )}
                  {valuationResult.factors.condition < 85 && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Condition:</strong> Professional cleaning and minor repairs could improve your valuation.
                      </AlertDescription>
                    </Alert>
                  )}
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Timing:</strong> Consider seasonal trends when selling - spring typically sees higher demand.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* No Results State */}
      {!valuationResult && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Value Your Vehicle?
            </h3>
            <p className="text-gray-600 mb-4">
              Choose a method above to get started with your vehicle valuation.
              Get instant results with depreciation forecasting and market analysis.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
