"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PostcodeInput from "@/components/ui/PostcodeInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Filter,
  Search,
  Star,
  Bell,
  Save,
  X,
  Calendar,
  Fuel,
  Gauge,
  MapPin,
  PoundSterling,
  Settings,
  AlertCircle
} from "lucide-react";

interface SearchFilters {
  // Basic filters
  make: string;
  model: string;
  priceMin: number;
  priceMax: number;
  yearMin: number;
  yearMax: number;
  mileageMax: number;

  // Advanced filters
  fuelTypes: string[];
  transmissions: string[];
  bodyTypes: string[];
  doors: string[];
  engineSizeMin: number;
  engineSizeMax: number;

  // Feature filters
  features: string[];

  // Location & logistics
  postcode: string;
  searchRadius: number;
  sellerTypes: string[];

  // Condition & history
  conditions: string[];
  maxPreviousOwners: number;
  minServiceHistory: boolean;

  // Sorting & alerts
  sortBy: string;
  alertsEnabled: boolean;
  savedSearchName: string;
}

const defaultFilters: SearchFilters = {
  make: "",
  model: "",
  priceMin: 0,
  priceMax: 50000,
  yearMin: 2000,
  yearMax: 2025,
  mileageMax: 200000,
  fuelTypes: [],
  transmissions: [],
  bodyTypes: [],
  doors: [],
  engineSizeMin: 0,
  engineSizeMax: 5,
  features: [],
  postcode: "",
  searchRadius: 25,
  sellerTypes: [],
  conditions: [],
  maxPreviousOwners: 5,
  minServiceHistory: false,
  sortBy: "date_desc",
  alertsEnabled: false,
  savedSearchName: ""
};

const carMakes = [
  "Audi", "BMW", "Ford", "Honda", "Hyundai", "Kia", "Mazda", "Mercedes-Benz",
  "Nissan", "Peugeot", "Renault", "Seat", "Skoda", "Toyota", "Vauxhall", "Volkswagen"
];

const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];
const transmissions = ["Manual", "Automatic", "CVT", "Semi-Automatic"];
const bodyTypes = ["Hatchback", "Saloon", "Estate", "SUV", "Convertible", "Coupe", "MPV"];
const doorOptions = ["2", "3", "4", "5"];
const sellerTypes = ["Dealer", "Private"];
const conditions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

const features = [
  "Air Conditioning", "Bluetooth", "Cruise Control", "Electric Windows",
  "Heated Seats", "Leather Seats", "Navigation System", "Parking Sensors",
  "Reverse Camera", "Sunroof", "Alloy Wheels", "Central Locking",
  "Power Steering", "ABS", "ESP", "Multiple Airbags"
];

export default function AdvancedSearchFilters() {
  const { data: session } = useSession();
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    if (session) {
      loadSavedSearches();
    }
  }, [session]);

  const loadSavedSearches = async () => {
    try {
      const response = await fetch('/api/saved-searches');
      if (response.ok) {
        const data = await response.json();
        setSavedSearches(data.searches);
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/search/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async () => {
    if (!session || !filters.savedSearchName) return;

    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: filters.savedSearchName,
          filters,
          alertsEnabled: filters.alertsEnabled
        })
      });

      if (response.ok) {
        setShowSaveDialog(false);
        loadSavedSearches();
        updateFilter('savedSearchName', '');
      }
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  const loadSavedSearch = (search: any) => {
    setFilters({ ...search.filters, savedSearchName: search.name });
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="space-y-6">
      {/* Saved Searches */}
      {session && savedSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Your Saved Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((search) => (
                <Button
                  key={search.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadSavedSearch(search)}
                  className="flex items-center gap-2"
                >
                  {search.alertsEnabled && <Bell className="h-3 w-3" />}
                  {search.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Search Filters
          </CardTitle>
          <CardDescription>
            Use detailed filters to find exactly what you're looking for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="condition">Condition</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* Make & Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Make</Label>
                  <Select value={filters.make} onValueChange={(value) => updateFilter("make", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any make</SelectItem>
                      {carMakes.map((make) => (
                        <SelectItem key={make} value={make.toLowerCase()}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input
                    placeholder="Any model"
                    value={filters.model}
                    onChange={(e) => updateFilter("model", e.target.value)}
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <PoundSterling className="h-4 w-4" />
                  Price Range: £{filters.priceMin.toLocaleString()} - £{filters.priceMax.toLocaleString()}
                </Label>
                <div className="px-3">
                  <Slider
                    value={[filters.priceMin, filters.priceMax]}
                    onValueChange={([min, max]) => {
                      updateFilter("priceMin", min);
                      updateFilter("priceMax", max);
                    }}
                    max={100000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Minimum</Label>
                    <Input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => updateFilter("priceMin", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Maximum</Label>
                    <Input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => updateFilter("priceMax", Number.parseInt(e.target.value) || 50000)}
                    />
                  </div>
                </div>
              </div>

              {/* Year Range */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Year Range: {filters.yearMin} - {filters.yearMax}
                </Label>
                <div className="px-3">
                  <Slider
                    value={[filters.yearMin, filters.yearMax]}
                    onValueChange={([min, max]) => {
                      updateFilter("yearMin", min);
                      updateFilter("yearMax", max);
                    }}
                    max={2025}
                    min={1990}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Mileage */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Maximum Mileage: {filters.mileageMax.toLocaleString()} miles
                </Label>
                <div className="px-3">
                  <Slider
                    value={[filters.mileageMax]}
                    onValueChange={([value]) => updateFilter("mileageMax", value)}
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Fuel Type & Transmission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Fuel Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {fuelTypes.map((fuel) => (
                      <label key={fuel} className="flex items-center space-x-2 text-sm">
                        <Checkbox
                          checked={filters.fuelTypes.includes(fuel)}
                          onCheckedChange={() => toggleArrayFilter("fuelTypes", fuel)}
                        />
                        <span>{fuel}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Transmission</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {transmissions.map((trans) => (
                      <label key={trans} className="flex items-center space-x-2 text-sm">
                        <Checkbox
                          checked={filters.transmissions.includes(trans)}
                          onCheckedChange={() => toggleArrayFilter("transmissions", trans)}
                        />
                        <span>{trans}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body Type */}
              <div className="space-y-3">
                <Label>Body Type</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {bodyTypes.map((body) => (
                    <label key={body} className="flex items-center space-x-2 text-sm">
                      <Checkbox
                        checked={filters.bodyTypes.includes(body)}
                        onCheckedChange={() => toggleArrayFilter("bodyTypes", body)}
                      />
                      <span>{body}</span>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 mt-6">
              <div className="space-y-3">
                <Label>Required Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {features.map((feature) => (
                    <label key={feature} className="flex items-center space-x-2 text-sm">
                      <Checkbox
                        checked={filters.features.includes(feature)}
                        onCheckedChange={() => toggleArrayFilter("features", feature)}
                      />
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="condition" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Condition</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {conditions.map((condition) => (
                      <label key={condition} className="flex items-center space-x-2 text-sm">
                        <Checkbox
                          checked={filters.conditions.includes(condition)}
                          onCheckedChange={() => toggleArrayFilter("conditions", condition)}
                        />
                        <span>{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Maximum Previous Owners: {filters.maxPreviousOwners}</Label>
                  <div className="px-3">
                    <Slider
                      value={[filters.maxPreviousOwners]}
                      onValueChange={([value]) => updateFilter("maxPreviousOwners", value)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <label className="flex items-center space-x-3">
                  <Checkbox
                    checked={filters.minServiceHistory}
                    onCheckedChange={(checked) => updateFilter("minServiceHistory", checked)}
                  />
                  <span>Must have service history</span>
                </label>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Postcode
                  </Label>
                  <PostcodeInput
                    value={filters.postcode}
                    onChange={(value) => updateFilter("postcode", value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Search Radius: {filters.searchRadius} miles</Label>
                  <div className="px-3">
                    <Slider
                      value={[filters.searchRadius]}
                      onValueChange={([value]) => updateFilter("searchRadius", value)}
                      max={200}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Seller Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {sellerTypes.map((seller) => (
                    <label key={seller} className="flex items-center space-x-2 text-sm">
                      <Checkbox
                        checked={filters.sellerTypes.includes(seller)}
                        onCheckedChange={() => toggleArrayFilter("sellerTypes", seller)}
                      />
                      <span>{seller}</span>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button onClick={handleSearch} disabled={loading} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Search Vehicles"}
            </Button>

            {session && (
              <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
                <Save className="h-4 w-4 mr-2" />
                Save Search
              </Button>
            )}

            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <Card>
          <CardHeader>
            <CardTitle>Save Search</CardTitle>
            <CardDescription>
              Save these filters to get notified of new matches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search Name</Label>
              <Input
                placeholder="e.g., Family Car Under £15k"
                value={filters.savedSearchName}
                onChange={(e) => updateFilter("savedSearchName", e.target.value)}
              />
            </div>

            <label className="flex items-center space-x-3">
              <Switch
                checked={filters.alertsEnabled}
                onCheckedChange={(checked) => updateFilter("alertsEnabled", checked)}
              />
              <span>Enable email alerts for new matches</span>
            </label>

            <div className="flex gap-3">
              <Button onClick={saveSearch} disabled={!filters.savedSearchName}>
                <Save className="h-4 w-4 mr-2" />
                Save Search
              </Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((car, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{car.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="text-xl font-bold text-blue-600">£{car.price?.toLocaleString()}</p>
                      <p>{car.year} • {car.mileage?.toLocaleString()} miles</p>
                      <p>{car.fuelType} • {car.transmission}</p>
                      <p>{car.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
