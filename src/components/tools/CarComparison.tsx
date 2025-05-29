"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  X,
  Car,
  Fuel,
  Gauge,
  Calendar,
  PoundSterling,
  Zap,
  Shield,
  Star,
  TrendingUp,
  BarChart3,
  Info,
  CheckCircle,
  XCircle,
  Minus
} from "lucide-react";

// Matches ApiVehicle structure more closely, with adaptations for component needs
interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  price: { // API provides price as an object
    amount: number;
    currency: string;
  };
  image?: string; // Corresponds to imageUrl in ApiVehicle
  specs: {
    engine?: string;
    power?: string; // Component might display "184 hp". API provides horsepower as number.
    torque?: string; // Component might display "300 Nm". API provides torque as number.
    transmission?: string;
    drivetrain?: string;
    fuelType?: string;
    fuelCapacity?: string; // For electric cars, this might be kWh. Consider how to display.
    mpgCombined?: number; // API: mileage.combined (ensure unit consistency or transform)
    mpgUrban?: number; // Not in ApiVehicle, handle if component uses it
    mpgExtraUrban?: number; // Not in ApiVehicle, handle if component uses it
    co2Emissions?: number;
    acceleration?: number; // API provides { value, unit }
    topSpeed?: number; // API provides { value, unit }
    length?: number; // API: dimensions.lengthMm
    width?: number; // API: dimensions.widthMm
    height?: number; // API: dimensions.heightMm
    wheelbase?: number; // API: dimensions.wheelbaseMm
    bootSpace?: number; // API provides cargoVolumeL
    seats?: number; // API provides seatingCapacity
    doors?: number; // Not in ApiVehicle
    kerbWeight?: number; // API provides weightKg
    maxTowingWeight?: number; // Not in ApiVehicle
  };
  features: { // API provides features as simple string arrays
    safety: string[];
    comfort: string[];
    technology: string[];
    exterior: string[]; // Not in ApiVehicle
    interior: string[]; // Not in ApiVehicle
  };
  costs: { // API provides runningCosts
    insurance?: number; // API provides insuranceGroup (number), might need transformation or be a direct value
    roadTax?: number; // API provides roadTaxPerYear (number)
    serviceInterval?: number; // Not in ApiVehicle
    warrantyYears?: number; // Not in ApiVehicle
  };
  ratings: { // API provides ratings
    overall?: number;
    reliability?: number; // Not in ApiVehicle
    safety?: number;
    performance?: number;
    economy?: number; // API provides fuelEconomy
  };
}


// ApiVehicle structure from src/app/api/cars/compare/route.ts for reference during transformation
interface ApiVehicle {
  id: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  price: {
    amount: number;
    currency: string;
  };
  imageUrl?: string;
  specifications: {
    engine?: string;
    horsepower?: number;
    torque?: number; 
    transmission?: string;
    drivetrain?: string;
    fuelType?: string;
    mileage?: {
      city?: number;
      highway?: number;
      combined?: number;
      unit: string; 
    };
    co2Emissions?: number; 
    acceleration?: { 
      value: number;
      unit: string; 
    };
    topSpeed?: {
      value: number;
      unit: string; 
    };
    dimensions?: {
      lengthMm?: number;
      widthMm?: number;
      heightMm?: number;
      wheelbaseMm?: number;
      cargoVolumeL?: number;
    };
    weightKg?: number;
    seatingCapacity?: number;
  };
  features?: {
    safety?: string[];
    comfort?: string[];
    technology?: string[];
    interior?: string[];
    exterior?: string[];
  };
  runningCosts?: {
    insuranceGroup?: number;
    roadTaxPerYear?: number;
  };
  ratings?: {
    overall?: number;
    safety?: number;
    reliability?: number;
    performance?: number;
    fuelEconomy?: number;
  };
}


export default function CarComparison() {
  const [selectedCars, setSelectedCars] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and transform data
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/cars/compare');
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText} (status: ${response.status})`);
        }
        const apiData: ApiVehicle[] = await response.json();
        
        const transformedVehicles: Vehicle[] = apiData.map(apiCar => ({
          id: apiCar.id,
          make: apiCar.make,
          model: apiCar.model,
          variant: apiCar.variant,
          year: apiCar.year,
          price: apiCar.price, 
          image: apiCar.imageUrl,
          specs: {
            engine: apiCar.specifications.engine,
            power: apiCar.specifications.horsepower ? `${apiCar.specifications.horsepower} hp` : undefined,
            torque: apiCar.specifications.torque ? `${apiCar.specifications.torque} Nm` : undefined,
            transmission: apiCar.specifications.transmission,
            drivetrain: apiCar.specifications.drivetrain,
            fuelType: apiCar.specifications.fuelType,
            // fuelCapacity is tricky: API doesn't explicitly provide it.
            // For this example, we'll leave it undefined. A real app would need a consistent source.
            fuelCapacity: undefined, 
            mpgCombined: apiCar.specifications.mileage?.combined,
            mpgUrban: apiCar.specifications.mileage?.city, // Mapping city to urban
            mpgExtraUrban: apiCar.specifications.mileage?.highway, // Mapping highway to extra-urban
            co2Emissions: apiCar.specifications.co2Emissions,
            acceleration: apiCar.specifications.acceleration?.value,
            topSpeed: apiCar.specifications.topSpeed?.value,
            length: apiCar.specifications.dimensions?.lengthMm,
            width: apiCar.specifications.dimensions?.widthMm,
            height: apiCar.specifications.dimensions?.heightMm,
            wheelbase: apiCar.specifications.dimensions?.wheelbaseMm,
            bootSpace: apiCar.specifications.dimensions?.cargoVolumeL,
            seats: apiCar.specifications.seatingCapacity,
            kerbWeight: apiCar.specifications.weightKg,
            // doors: undefined, // Not in ApiVehicle - will remain undefined
            // maxTowingWeight: undefined, // Not in ApiVehicle - will remain undefined
          },
          features: { 
            safety: apiCar.features?.safety || [],
            comfort: apiCar.features?.comfort || [],
            technology: apiCar.features?.technology || [],
            exterior: apiCar.features?.exterior || [], 
            interior: apiCar.features?.interior || [], 
          },
          costs: {
            insurance: apiCar.runningCosts?.insuranceGroup, 
            roadTax: apiCar.runningCosts?.roadTaxPerYear,
            // serviceInterval: undefined, // Not in ApiVehicle - will remain undefined
            // warrantyYears: undefined, // Not in ApiVehicle - will remain undefined
          },
          ratings: {
            overall: apiCar.ratings?.overall,
            reliability: apiCar.ratings?.reliability, 
            safety: apiCar.ratings?.safety,
            performance: apiCar.ratings?.performance,
            economy: apiCar.ratings?.fuelEconomy,
          }
        }));
        setVehicles(transformedVehicles);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred while fetching car data.");
        }
        console.error("Fetch error:", e); // Log error for debugging
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);


  const availableCars = vehicles.filter(car => // Use 'vehicles' state
    !selectedCars.find(selected => selected.id === car.id)
  );

  const filteredCars = availableCars.filter(car =>
    `${car.make} ${car.model} ${car.variant || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCar = (car: Vehicle) => {
    if (selectedCars.length < 4) {
      setSelectedCars([...selectedCars, car]);
      setSearchTerm("");
    }
  };

  const removeCar = (carId: string) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId));
  };

  const clearAll = () => {
    setSelectedCars([]);
  };

  // Updated to handle price object
  const formatCurrency = (price?: {amount: number, currency: string}) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: price.currency || 'GBP', // Default to GBP if currency not specified
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price.amount);
  };
  
  const getWinner = (values: (number | undefined)[], higherIsBetter = true) => {
    const validValues = values.filter(v => typeof v === 'number') as number[];
    if (validValues.length === 0) return -1;
    const bestValue = higherIsBetter ? Math.max(...validValues) : Math.min(...validValues);
    // Find the index in the original array, considering undefined values
    return values.findIndex(v => v === bestValue);
  };

  const getComparisonClass = (value: number | undefined, values: (number | undefined)[], index: number, higherIsBetter = true) => {
    if (typeof value !== 'number') return "text-gray-500"; // For undefined values
    const winnerIndex = getWinner(values, higherIsBetter);
    if (index === winnerIndex) return "text-green-600 font-semibold";
    return "text-gray-700";
  };


  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="text-xl font-semibold">Loading cars...</div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="text-xl font-semibold text-red-600">Error: {error}</div>
  //     </div>
  //   );
  // }
  
  // if (vehicles.length === 0 && !isLoading) {
  //    return (
  //     <div className="text-center py-12">
  //       <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
  //       <h3 className="text-lg font-semibold mb-2">No Cars Available</h3>
  //       <p className="text-gray-600">
  //         There are currently no cars to compare. Please check back later or try adjusting your search.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Car Comparison Tool
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Compare up to 4 vehicles side-by-side. Analyze specifications, features, and costs
          to make the best decision for your needs.
        </p>
      </div>
      
      {/* Loading and Error States */}
      {isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">Loading Car Data...</h3>
            <p className="text-gray-600">Please wait while we fetch the latest vehicle information.</p>
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
         <Card className="border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <XCircle className="h-5 w-5" /> Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              We encountered an error while fetching car data: {error}. 
              Please try refreshing the page or check back later.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && vehicles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Cars Available</h3>
            <p className="text-gray-600">
              There are currently no cars to compare from the API. Please check back later.
            </p>
          </CardContent>
        </Card>
      )}


      {/* Car Selection - Only show if not loading, no error, and vehicles exist */}
      {!isLoading && !error && vehicles.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Add Cars to Compare
          </CardTitle>
          <CardDescription>
            Search and select up to 4 vehicles to compare. You have {selectedCars.length}/4 cars selected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for cars (e.g., BMW 3 Series, Audi A4...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCars.slice(0, 6).map(car => (
                  <Card key={car.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <img
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{car.variant} ({car.year})</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(car.price)}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => addCar(car)}
                          disabled={selectedCars.length >= 4}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Selected Cars */}
            {selectedCars.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Selected Cars ({selectedCars.length}/4)</h3>
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedCars.map(car => (
                    <Card key={car.id} className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => removeCar(car.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <CardContent className="p-4">
                        <img
                          src={car.image}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h4 className="font-semibold text-sm mb-1">
                          {car.make} {car.model}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">{car.variant}</p>
                        <p className="text-sm font-bold text-blue-600">
                          {formatCurrency(car.price)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedCars.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Vehicle Comparison
            </CardTitle>
            <CardDescription>
              Detailed side-by-side comparison of your selected vehicles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="economy">Economy</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 w-48">Vehicle</th>
                        {selectedCars.map(car => (
                          <th key={car.id} className="text-center p-4">
                            <div className="space-y-2">
                              <img
                                src={car.image}
                                alt={`${car.make} ${car.model}`}
                                className="w-24 h-16 object-cover rounded mx-auto"
                              />
                              <div className="text-sm font-semibold">
                                {car.make} {car.model}
                              </div>
                              <div className="text-xs text-gray-600">{car.variant}</div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4 font-medium">Price</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.price, selectedCars.map(c => c.price), index, false)}`}>
                            {formatCurrency(car.price)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Year</td>
                        {selectedCars.map(car => (
                          <td key={car.id} className="p-4 text-center">{car.year}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Engine</td>
                        {selectedCars.map(car => (
                          <td key={car.id} className="p-4 text-center text-sm">{car.specs.engine}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Power</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(Number.parseInt(car.specs.power), selectedCars.map(c => Number.parseInt(c.specs.power)), index)}`}>
                            {car.specs.power}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Transmission</td>
                        {selectedCars.map(car => (
                          <td key={car.id} className="p-4 text-center text-sm">{car.specs.transmission}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Fuel Type</td>
                        {selectedCars.map(car => (
                          <td key={car.id} className="p-4 text-center">{car.specs.fuelType}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Overall Rating</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.ratings.overall, selectedCars.map(c => c.ratings.overall), index)}`}>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {car.ratings.overall}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Specification</th>
                        {selectedCars.map(car => (
                          <th key={car.id} className="text-center p-4">
                            {car.make} {car.model}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4 font-medium flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Power
                        </td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(Number.parseInt(car.specs.power), selectedCars.map(c => Number.parseInt(c.specs.power)), index)}`}>
                            {car.specs.power}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium flex items-center gap-2">
                          <Gauge className="h-4 w-4" />
                          Torque
                        </td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(Number.parseInt(car.specs.torque), selectedCars.map(c => Number.parseInt(c.specs.torque)), index)}`}>
                            {car.specs.torque}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">0-60 mph</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.specs.acceleration, selectedCars.map(c => c.specs.acceleration), index, false)}`}>
                            {car.specs.acceleration}s
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Top Speed</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.specs.topSpeed, selectedCars.map(c => c.specs.topSpeed), index)}`}>
                            {car.specs.topSpeed} mph
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Drivetrain</td>
                        {selectedCars.map(car => (
                          <td key={car.id} className="p-4 text-center">{car.specs.drivetrain}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Kerb Weight</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.specs.kerbWeight, selectedCars.map(c => c.specs.kerbWeight), index, false)}`}>
                            {car.specs.kerbWeight} kg
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Max Towing</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.specs.maxTowingWeight, selectedCars.map(c => c.specs.maxTowingWeight), index)}`}>
                            {car.specs.maxTowingWeight} kg
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Economy Tab */}
              <TabsContent value="economy" className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Economy & Environment</th>
                        {selectedCars.map(car => (
                          <th key={car.id} className="text-center p-4">
                            {car.make} {car.model}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4 font-medium flex items-center gap-2">
                          <Fuel className="h-4 w-4" />
                          Combined MPG
                        </td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${car.specs.fuelType === 'Electric' ? 'text-gray-500' : getComparisonClass(car.specs.mpgCombined, selectedCars.filter(c => c.specs.fuelType !== 'Electric').map(c => c.specs.mpgCombined), index)}`}>
                            {car.specs.fuelType === 'Electric' ? 'N/A (Electric)' : `${car.specs.mpgCombined} mpg`}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Urban MPG</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${car.specs.fuelType === 'Electric' ? 'text-gray-500' : getComparisonClass(car.specs.mpgUrban, selectedCars.filter(c => c.specs.fuelType !== 'Electric').map(c => c.specs.mpgUrban), index)}`}>
                            {car.specs.fuelType === 'Electric' ? 'N/A (Electric)' : `${car.specs.mpgUrban} mpg`}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Extra-Urban MPG</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${car.specs.fuelType === 'Electric' ? 'text-gray-500' : getComparisonClass(car.specs.mpgExtraUrban, selectedCars.filter(c => c.specs.fuelType !== 'Electric').map(c => c.specs.mpgExtraUrban), index)}`}>
                            {car.specs.fuelType === 'Electric' ? 'N/A (Electric)' : `${car.specs.mpgExtraUrban} mpg`}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">CO₂ Emissions</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.specs.co2Emissions, selectedCars.map(c => c.specs.co2Emissions), index, false)}`}>
                            {car.specs.co2Emissions === 0 ? '0 g/km (Zero Emissions)' : `${car.specs.co2Emissions} g/km`}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Fuel Capacity</td>
                        {selectedCars.map(car => (
                          <td key={car.id} className="p-4 text-center">
                            {car.specs.fuelType === 'Electric' ? `${car.specs.fuelCapacity} Battery` : car.specs.fuelCapacity}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Range (Estimated)</td>
                        {selectedCars.map(car => (
                          <td key={car.id} className="p-4 text-center">
                            {car.specs.fuelType === 'Electric' ? '358 miles' :
                             `${Math.round((Number.parseFloat(car.specs.fuelCapacity) * car.specs.mpgCombined))} miles`}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6">
                <div className="grid gap-6">
                  {['safety', 'technology', 'comfort'].map(category => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2">
                        {category === 'safety' && <Shield className="h-5 w-5" />}
                        {category === 'technology' && <Zap className="h-5 w-5" />}
                        {category === 'comfort' && <Star className="h-5 w-5" />}
                        {category} Features
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-4 w-48">Feature</th>
                              {selectedCars.map(car => (
                                <th key={car.id} className="text-center p-4">
                                  {car.make} {car.model}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {/* Get all unique features for this category */}
                            {Array.from(new Set(selectedCars.flatMap(car => car.features[category as keyof typeof car.features]))).map(feature => (
                              <tr key={feature}>
                                <td className="p-4 font-medium">{feature}</td>
                                {selectedCars.map(car => (
                                  <td key={car.id} className="p-4 text-center">
                                    {car.features[category as keyof typeof car.features].includes(feature) ? (
                                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Costs Tab */}
              <TabsContent value="costs" className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Cost Factor</th>
                        {selectedCars.map(car => (
                          <th key={car.id} className="text-center p-4">
                            {car.make} {car.model}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4 font-medium flex items-center gap-2">
                          <PoundSterling className="h-4 w-4" />
                          Purchase Price
                        </td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.price, selectedCars.map(c => c.price), index, false)}`}>
                            {formatCurrency(car.price)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Annual Insurance (Est.)</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.costs.insurance, selectedCars.map(c => c.costs.insurance), index, false)}`}>
                            {formatCurrency(car.costs.insurance)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Annual Road Tax</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.costs.roadTax, selectedCars.map(c => c.costs.roadTax), index, false)}`}>
                            {car.costs.roadTax === 0 ? 'Free' : formatCurrency(car.costs.roadTax)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Service Interval</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.costs.serviceInterval, selectedCars.map(c => c.costs.serviceInterval), index)}`}>
                            {car.costs.serviceInterval} months
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Warranty</td>
                        {selectedCars.map((car, index) => (
                          <td key={car.id} className={`p-4 text-center ${getComparisonClass(car.costs.warrantyYears, selectedCars.map(c => c.costs.warrantyYears), index)}`}>
                            {car.costs.warrantyYears} years
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">3-Year Total Cost</td>
                        {selectedCars.map((car, index) => {
                          const totalCost = car.price + (car.costs.insurance * 3) + (car.costs.roadTax * 3);
                          const allTotalCosts = selectedCars.map(c => c.price + (c.costs.insurance * 3) + (c.costs.roadTax * 3));
                          return (
                            <td key={car.id} className={`p-4 text-center font-semibold ${getComparisonClass(totalCost, allTotalCosts, index, false)}`}>
                              {formatCurrency(totalCost)}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {selectedCars.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to compare cars?</h3>
            <p className="text-gray-600 mb-4">
              Search for vehicles above and add them to start comparing specifications, features, and costs.
            </p>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Add at least 2 cars to begin comparison
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
