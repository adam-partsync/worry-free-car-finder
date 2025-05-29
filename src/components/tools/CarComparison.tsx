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

interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  image: string;
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    drivetrain: string;
    fuelType: string;
    fuelCapacity: string;
    mpgCombined: number;
    mpgUrban: number;
    mpgExtraUrban: number;
    co2Emissions: number;
    acceleration: number;
    topSpeed: number;
    length: number;
    width: number;
    height: number;
    wheelbase: number;
    bootSpace: number;
    seats: number;
    doors: number;
    kerbWeight: number;
    maxTowingWeight: number;
  };
  features: {
    safety: string[];
    comfort: string[];
    technology: string[];
    exterior: string[];
    interior: string[];
  };
  costs: {
    insurance: number;
    roadTax: number;
    serviceInterval: number;
    warrantyYears: number;
  };
  ratings: {
    overall: number;
    reliability: number;
    safety: number;
    performance: number;
    economy: number;
  };
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    make: "BMW",
    model: "3 Series",
    variant: "320i M Sport",
    year: 2024,
    price: 38500,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
    specs: {
      engine: "2.0L Turbo Petrol",
      power: "184 hp",
      torque: "300 Nm",
      transmission: "8-speed Automatic",
      drivetrain: "RWD",
      fuelType: "Petrol",
      fuelCapacity: "59L",
      mpgCombined: 44.1,
      mpgUrban: 35.8,
      mpgExtraUrban: 54.3,
      co2Emissions: 145,
      acceleration: 7.1,
      topSpeed: 155,
      length: 4709,
      width: 1827,
      height: 1442,
      wheelbase: 2851,
      bootSpace: 480,
      seats: 5,
      doors: 4,
      kerbWeight: 1570,
      maxTowingWeight: 1600
    },
    features: {
      safety: ["ABS", "ESP", "6 Airbags", "Lane Departure Warning", "Automatic Emergency Braking"],
      comfort: ["Climate Control", "Heated Seats", "Electric Seats", "Cruise Control", "Rain Sensors"],
      technology: ["iDrive", "Apple CarPlay", "Wireless Charging", "Digital Cockpit", "Head-up Display"],
      exterior: ["LED Headlights", "18\" Alloys", "M Sport Styling", "Parking Sensors", "Reversing Camera"],
      interior: ["Leather Seats", "Sport Steering Wheel", "Ambient Lighting", "Premium Audio", "Electric Windows"]
    },
    costs: {
      insurance: 850,
      roadTax: 190,
      serviceInterval: 12,
      warrantyYears: 3
    },
    ratings: {
      overall: 4.5,
      reliability: 4.3,
      safety: 4.8,
      performance: 4.6,
      economy: 4.2
    }
  },
  {
    id: "2",
    make: "Audi",
    model: "A4",
    variant: "35 TFSI S Line",
    year: 2024,
    price: 36200,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop",
    specs: {
      engine: "2.0L Turbo Petrol",
      power: "150 hp",
      torque: "250 Nm",
      transmission: "S tronic Automatic",
      drivetrain: "FWD",
      fuelType: "Petrol",
      fuelCapacity: "58L",
      mpgCombined: 47.9,
      mpgUrban: 38.7,
      mpgExtraUrban: 60.1,
      co2Emissions: 134,
      acceleration: 8.6,
      topSpeed: 148,
      length: 4762,
      width: 1847,
      height: 1428,
      wheelbase: 2820,
      bootSpace: 460,
      seats: 5,
      doors: 4,
      kerbWeight: 1395,
      maxTowingWeight: 1800
    },
    features: {
      safety: ["ABS", "ESP", "6 Airbags", "Audi Pre Sense", "Lane Assist"],
      comfort: ["3-Zone Climate", "Heated Seats", "Electric Seats", "Adaptive Cruise", "Auto Lights"],
      technology: ["MMI Touch", "Apple CarPlay", "Virtual Cockpit", "Audi Connect", "Bang & Olufsen"],
      exterior: ["LED Matrix Headlights", "19\" Alloys", "S Line Styling", "Progressive Steering", "Rear Camera"],
      interior: ["Leather/Alcantara", "Sport Seats", "Aluminium Trim", "Ambient Lighting", "Electric Tailgate"]
    },
    costs: {
      insurance: 780,
      roadTax: 170,
      serviceInterval: 12,
      warrantyYears: 3
    },
    ratings: {
      overall: 4.4,
      reliability: 4.1,
      safety: 4.7,
      performance: 4.2,
      economy: 4.5
    }
  },
  {
    id: "3",
    make: "Mercedes-Benz",
    model: "C-Class",
    variant: "C200 AMG Line",
    year: 2024,
    price: 41800,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop",
    specs: {
      engine: "1.5L Turbo Petrol + EQBoost",
      power: "204 hp",
      torque: "300 Nm",
      transmission: "9G-Tronic Automatic",
      drivetrain: "RWD",
      fuelType: "Mild Hybrid",
      fuelCapacity: "66L",
      mpgCombined: 44.8,
      mpgUrban: 36.2,
      mpgExtraUrban: 56.5,
      co2Emissions: 142,
      acceleration: 7.3,
      topSpeed: 155,
      length: 4751,
      width: 1820,
      height: 1437,
      wheelbase: 2865,
      bootSpace: 455,
      seats: 5,
      doors: 4,
      kerbWeight: 1640,
      maxTowingWeight: 1800
    },
    features: {
      safety: ["ABS", "ESP", "9 Airbags", "Pre-Safe", "Active Brake Assist", "Blind Spot Assist"],
      comfort: ["Thermomatic", "Heated Seats", "Memory Seats", "Active Parking", "Keyless Start"],
      technology: ["MBUX", "12.3\" Display", "Wireless Android Auto", "64-Color Ambient", "Burmester Audio"],
      exterior: ["LED High Performance", "19\" AMG Alloys", "AMG Styling", "360° Camera", "Digital Light"],
      interior: ["Artico Leather", "AMG Seats", "Carbon Trim", "Multibeam LED", "Panoramic Roof"]
    },
    costs: {
      insurance: 920,
      roadTax: 180,
      serviceInterval: 12,
      warrantyYears: 3
    },
    ratings: {
      overall: 4.6,
      reliability: 4.2,
      safety: 4.9,
      performance: 4.5,
      economy: 4.3
    }
  },
  {
    id: "4",
    make: "Tesla",
    model: "Model 3",
    variant: "Long Range",
    year: 2024,
    price: 48990,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop",
    specs: {
      engine: "Dual Motor Electric",
      power: "366 hp",
      torque: "493 Nm",
      transmission: "Single Speed",
      drivetrain: "AWD",
      fuelType: "Electric",
      fuelCapacity: "75 kWh",
      mpgCombined: 0, // Electric equivalent
      mpgUrban: 0,
      mpgExtraUrban: 0,
      co2Emissions: 0,
      acceleration: 4.4,
      topSpeed: 162,
      length: 4694,
      width: 1849,
      height: 1443,
      wheelbase: 2875,
      bootSpace: 425,
      seats: 5,
      doors: 4,
      kerbWeight: 1844,
      maxTowingWeight: 1000
    },
    features: {
      safety: ["ABS", "ESP", "8 Airbags", "Autopilot", "Automatic Emergency Braking", "Collision Warning"],
      comfort: ["Climate Control", "Heated Seats", "Premium Audio", "Keyless Entry", "Phone Key"],
      technology: ["15\" Touchscreen", "OTA Updates", "Supercharger Access", "Mobile App", "Sentry Mode"],
      exterior: ["LED Lights", "18\" Aero Wheels", "Glass Roof", "Auto-Present Handles", "Tinted Glass"],
      interior: ["Vegan Leather", "Wood Trim", "Wireless Charging", "4 USB-C Ports", "HEPA Filter"]
    },
    costs: {
      insurance: 1200,
      roadTax: 0,
      serviceInterval: 24,
      warrantyYears: 4
    },
    ratings: {
      overall: 4.7,
      reliability: 4.0,
      safety: 4.8,
      performance: 4.9,
      economy: 4.8
    }
  },
  {
    id: "5",
    make: "Toyota",
    model: "Camry",
    variant: "2.5 Hybrid Design",
    year: 2024,
    price: 33995,
    image: "https://images.unsplash.com/photo-1627796744639-c7ea25411d47?w=400&h=250&fit=crop",
    specs: {
      engine: "2.5L Hybrid",
      power: "218 hp",
      torque: "221 Nm",
      transmission: "eCVT",
      drivetrain: "FWD",
      fuelType: "Hybrid",
      fuelCapacity: "50L",
      mpgCombined: 58.9,
      mpgUrban: 65.7,
      mpgExtraUrban: 53.3,
      co2Emissions: 109,
      acceleration: 8.3,
      topSpeed: 180,
      length: 4885,
      width: 1840,
      height: 1455,
      wheelbase: 2825,
      bootSpace: 524,
      seats: 5,
      doors: 4,
      kerbWeight: 1650,
      maxTowingWeight: 750
    },
    features: {
      safety: ["ABS", "ESP", "10 Airbags", "Toyota Safety Sense 2.0", "Pre-Collision System"],
      comfort: ["Dual Zone AC", "Heated/Ventilated Seats", "Power Seats", "Wireless Charging", "Smart Entry"],
      technology: ["9\" Touchscreen", "Toyota Touch 2", "JBL Premium Audio", "Head-up Display", "Connected Services"],
      exterior: ["LED Headlights", "18\" Alloys", "Shark Fin Antenna", "Rear Spoiler", "Chrome Accents"],
      interior: ["Leather Trim", "Soft-touch Materials", "Ambient Lighting", "Dual USB", "60:40 Split Seats"]
    },
    costs: {
      insurance: 650,
      roadTax: 140,
      serviceInterval: 12,
      warrantyYears: 5
    },
    ratings: {
      overall: 4.3,
      reliability: 4.7,
      safety: 4.6,
      performance: 4.1,
      economy: 4.7
    }
  }
];

export default function CarComparison() {
  const [selectedCars, setSelectedCars] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const availableCars = mockVehicles.filter(car =>
    !selectedCars.find(selected => selected.id === car.id)
  );

  const filteredCars = availableCars.filter(car =>
    `${car.make} ${car.model} ${car.variant}`.toLowerCase().includes(searchTerm.toLowerCase())
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getWinner = (values: number[], higherIsBetter = true) => {
    if (values.length === 0) return -1;
    const bestValue = higherIsBetter ? Math.max(...values) : Math.min(...values);
    return values.indexOf(bestValue);
  };

  const getComparisonClass = (value: number, values: number[], index: number, higherIsBetter = true) => {
    const winnerIndex = getWinner(values, higherIsBetter);
    if (index === winnerIndex) return "text-green-600 font-semibold";
    return "text-gray-700";
  };

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

      {/* Car Selection */}
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
