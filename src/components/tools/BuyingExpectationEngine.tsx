"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  PoundSterling,
  BarChart3,
  Target,
  Lightbulb,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

interface MarketData {
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
    q1: number;
    q3: number;
  };
  marketTrend: 'rising' | 'falling' | 'stable';
  trendPercentage: number;
  demandLevel: 'low' | 'medium' | 'high';
  supply: {
    available: number;
    averageDaysOnMarket: number;
  };
  depreciation: {
    nextYear: number;
    threeYear: number;
    fiveYear: number;
  };
  factors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
    priceImpact: number;
  }>;
  recommendations: {
    fairPrice: number;
    goodDeal: number;
    excellentDeal: number;
    negotiationTips: string[];
    timing: {
      bestMonthToBuy: string;
      worstMonthToBuy: string;
      reasoning: string;
    };
  };
  comparisons: Array<{
    make: string;
    model: string;
    averagePrice: number;
    pros: string[];
    cons: string[];
  }>;
}

const carMakes = [
  "Audi", "BMW", "Ford", "Honda", "Hyundai", "Kia", "Mazda", "Mercedes-Benz",
  "Nissan", "Peugeot", "Renault", "Seat", "Skoda", "Toyota", "Vauxhall", "Volkswagen"
];

export default function BuyingExpectationEngine() {
  const [vehicleData, setVehicleData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    condition: "good",
    bodyType: "",
    engineSize: "",
    postcode: ""
  });

  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMarketData(null);

    try {
      const response = await fetch('/api/price-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: vehicleData.make,
          model: vehicleData.model,
          year: Number.parseInt(vehicleData.year),
          mileage: Number.parseInt(vehicleData.mileage),
          fuelType: vehicleData.fuelType,
          transmission: vehicleData.transmission,
          condition: vehicleData.condition,
          bodyType: vehicleData.bodyType,
          engineSize: vehicleData.engineSize,
          postcode: vehicleData.postcode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setMarketData(data.marketData);
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const updateVehicleData = (field: string, value: string) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'falling':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-green-600';
      case 'falling':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatPrice = (price: number) => {
    return `£${price.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Vehicle Market Analysis
          </CardTitle>
          <CardDescription>
            Enter vehicle details to get comprehensive market pricing and buying recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Select value={vehicleData.make} onValueChange={(value) => updateVehicleData("make", value)}>
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
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g., Golf, Corolla"
                  value={vehicleData.model}
                  onChange={(e) => updateVehicleData("model", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2020"
                  min="1990"
                  max="2025"
                  value={vehicleData.year}
                  onChange={(e) => updateVehicleData("year", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage *</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="50000"
                  value={vehicleData.mileage}
                  onChange={(e) => updateVehicleData("mileage", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Select value={vehicleData.fuelType} onValueChange={(value) => updateVehicleData("fuelType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
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
                <Label htmlFor="transmission">Transmission *</Label>
                <Select value={vehicleData.transmission} onValueChange={(value) => updateVehicleData("transmission", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} size="lg" className="w-full md:w-auto">
              <BarChart3 className="h-4 w-4 mr-2" />
              {loading ? "Analyzing Market..." : "Analyze Market Value"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {marketData && (
        <div className="space-y-6">
          {/* Price Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PoundSterling className="h-5 w-5" />
                Market Price Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPrice(marketData.averagePrice)}
                  </div>
                  <div className="text-sm text-gray-600">Average Market Price</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getTrendIcon(marketData.marketTrend)}
                    <span className={`text-xl font-bold ${getTrendColor(marketData.marketTrend)}`}>
                      {marketData.trendPercentage > 0 ? '+' : ''}{marketData.trendPercentage}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    Market {marketData.marketTrend}
                  </div>
                </div>

                <div className="text-center">
                  <Badge className={`text-sm mb-2 ${getDemandColor(marketData.demandLevel)}`}>
                    {marketData.demandLevel.toUpperCase()} DEMAND
                  </Badge>
                  <div className="text-sm text-gray-600">Market Demand</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    {marketData.supply.averageDaysOnMarket} days
                  </div>
                  <div className="text-sm text-gray-600">Average Time on Market</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card>
            <CardHeader>
              <CardTitle>Price Range Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatPrice(marketData.priceRange.min)}</span>
                  <span>{formatPrice(marketData.priceRange.max)}</span>
                </div>
                <div className="relative">
                  <Progress value={50} className="h-4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Average: {formatPrice(marketData.averagePrice)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="font-medium">{formatPrice(marketData.priceRange.min)}</div>
                    <div className="text-gray-600">Minimum</div>
                  </div>
                  <div>
                    <div className="font-medium">{formatPrice(marketData.priceRange.q1)}</div>
                    <div className="text-gray-600">25th Percentile</div>
                  </div>
                  <div>
                    <div className="font-medium">{formatPrice(marketData.priceRange.q3)}</div>
                    <div className="text-gray-600">75th Percentile</div>
                  </div>
                  <div>
                    <div className="font-medium">{formatPrice(marketData.priceRange.max)}</div>
                    <div className="text-gray-600">Maximum</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="factors">Price Factors</TabsTrigger>
              <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
              <TabsTrigger value="comparisons">Alternatives</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-6">
              {/* Buying Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-green-200">
                  <CardHeader className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <CardTitle className="text-green-600">Excellent Deal</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatPrice(marketData.recommendations.excellentDeal)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Below market value - act quickly on listings at this price
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader className="text-center">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-blue-600">Good Deal</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {formatPrice(marketData.recommendations.goodDeal)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Fair value with some savings - worth considering
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader className="text-center">
                    <PoundSterling className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <CardTitle className="text-gray-600">Fair Price</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-gray-600 mb-2">
                      {formatPrice(marketData.recommendations.fairPrice)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Market rate - standard pricing for this vehicle
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Negotiation Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Negotiation Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {marketData.recommendations.negotiationTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Timing Advice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Best Time to Buy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-semibold text-green-800 mb-2">
                        Best Month: {marketData.recommendations.timing.bestMonthToBuy}
                      </div>
                      <p className="text-sm text-green-700">
                        {marketData.recommendations.timing.reasoning}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="font-semibold text-red-800 mb-2">
                        Avoid: {marketData.recommendations.timing.worstMonthToBuy}
                      </div>
                      <p className="text-sm text-red-700">
                        Typically the most expensive time due to high demand
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="factors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Factors Affecting Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketData.factors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getImpactIcon(factor.impact)}
                          <div>
                            <div className="font-medium">{factor.factor}</div>
                            <div className="text-sm text-gray-600">{factor.description}</div>
                          </div>
                        </div>
                        <div className={`font-semibold ${
                          factor.priceImpact > 0 ? 'text-green-600' :
                          factor.priceImpact < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {factor.priceImpact > 0 ? '+' : ''}{formatPrice(Math.abs(factor.priceImpact))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="depreciation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Depreciation Forecast</CardTitle>
                  <CardDescription>
                    Projected value loss over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {marketData.depreciation.nextYear}%
                      </div>
                      <div className="text-sm text-gray-600">Next Year</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {marketData.depreciation.threeYear}%
                      </div>
                      <div className="text-sm text-gray-600">Three Years</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Clock className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {marketData.depreciation.fiveYear}%
                      </div>
                      <div className="text-sm text-gray-600">Five Years</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparisons" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {marketData.comparisons.map((comparison, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {comparison.make} {comparison.model}
                      </CardTitle>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(comparison.averagePrice)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">Pros:</h4>
                          <ul className="space-y-1">
                            {comparison.pros.map((pro, proIndex) => (
                              <li key={proIndex} className="text-sm text-gray-700 flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-600 mb-2">Cons:</h4>
                          <ul className="space-y-1">
                            {comparison.cons.map((con, conIndex) => (
                              <li key={conIndex} className="text-sm text-gray-700 flex items-center gap-2">
                                <AlertCircle className="h-3 w-3 text-red-600" />
                                {con}
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
          </Tabs>
        </div>
      )}
    </div>
  );
}
