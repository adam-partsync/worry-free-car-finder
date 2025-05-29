"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PostcodeInput from "@/components/ui/PostcodeInput";
import { Search, Brain, Filter, MapPin, PoundSterling, Calendar, Gauge } from "lucide-react";

const carMakes = [
  "Audi", "BMW", "Ford", "Mercedes-Benz", "Nissan", "Toyota", "Vauxhall", "Volkswagen",
  "Honda", "Hyundai", "Kia", "Mazda", "Peugeot", "Renault", "Seat", "Skoda", "Volvo"
];

const yearOptions = Array.from({ length: 25 }, (_, i) => 2025 - i);

export default function SearchForm() {
  const [searchType, setSearchType] = useState<"filters" | "ai">("ai");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (searchType === "ai") {
        const response = await fetch('/api/search/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: formData.aiQuery,
            postcode: formData.postcode,
            radius: formData.radius
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("AI Search Results:", data);
          // TODO: Navigate to results page or show results
        } else {
          console.error("Search error:", data.error);
        }
      } else {
        console.log("Filter Search:", formData);
        // TODO: Implement filter-based search
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Find Your Perfect Car
        </CardTitle>
        <p className="text-gray-600">
          Use our AI search or detailed filters to find exactly what you're looking for
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "filters" | "ai")}>
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

          <form onSubmit={handleSubmit}>
            <TabsContent value="ai" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ai-query" className="text-base font-medium">
                  Describe what you're looking for
                </Label>
                <Textarea
                  id="ai-query"
                  placeholder="E.g., 'I need a reliable family car under £15,000 with low mileage, good for commuting and weekend trips. Prefer automatic transmission and good fuel economy.'"
                  value={formData.aiQuery}
                  onChange={(e) => updateFormData("aiQuery", e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">Family car under £15k</Badge>
                  <Badge variant="outline" className="text-xs">First car for teenager</Badge>
                  <Badge variant="outline" className="text-xs">Eco-friendly hybrid</Badge>
                  <Badge variant="outline" className="text-xs">Luxury sedan</Badge>
                </div>
              </div>

              {/* Location for AI search */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postcode-ai" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Postcode
                  </Label>
                  <PostcodeInput
                    id="postcode-ai"
                    value={formData.postcode}
                    onChange={(value) => updateFormData("postcode", value)}
                    placeholder="SW1A 1AA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius-ai">Search Radius</Label>
                  <Select value={formData.radius} onValueChange={(value) => updateFormData("radius", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                      <SelectItem value="100">100 miles</SelectItem>
                      <SelectItem value="nationwide">Nationwide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-6">
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

              {/* Mileage */}
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

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postcode" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Postcode
                  </Label>
                  <PostcodeInput
                    id="postcode"
                    value={formData.postcode}
                    onChange={(value) => updateFormData("postcode", value)}
                    placeholder="SW1A 1AA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius">Search Radius</Label>
                  <Select value={formData.radius} onValueChange={(value) => updateFormData("radius", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                      <SelectItem value="100">100 miles</SelectItem>
                      <SelectItem value="nationwide">Nationwide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Search Button */}
            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                <Search className="h-5 w-5 mr-2" />
                {searchType === "ai" ? "Search with AI" : "Search Cars"}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
