"use client";

import Link from "next/link";
import { useState } from "react";
import { Car, Search, User, HelpCircle, Wrench, Shield, Calculator, LogOut, Settings, FileText, TrendingUp, ShoppingCart, Target, ChevronDown } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";

export default function SimpleHeader() {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="md" showText={true} />
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-700 hover:text-blue-600">
              Search Cars
            </Link>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2"
              >
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-96 bg-white border rounded-lg shadow-lg p-4 grid grid-cols-2 gap-2 z-50">
                  <Link
                    href="/parts-comparison"
                    className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Parts Price Comparison</div>
                      <div className="text-xs text-gray-600">Compare parts prices</div>
                    </div>
                  </Link>

                  <Link
                    href="/vehicle-valuation"
                    className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    <Calculator className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Vehicle Valuation</div>
                      <div className="text-xs text-gray-600">Get vehicle values</div>
                    </div>
                  </Link>

                  <Link
                    href="/car-comparison"
                    className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    <Car className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Car Comparison</div>
                      <div className="text-xs text-gray-600">Compare vehicles</div>
                    </div>
                  </Link>

                  <Link
                    href="/tyre-shop-finder"
                    className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    <Target className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Tyre Shop Finder</div>
                      <div className="text-xs text-gray-600">Find tyre shops</div>
                    </div>
                  </Link>

                  <Link
                    href="/maintenance"
                    className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    <Wrench className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Maintenance Tracker</div>
                      <div className="text-xs text-gray-600">Track service history</div>
                    </div>
                  </Link>

                  <Link
                    href="/cost-calculator"
                    className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100"
                    onClick={() => setToolsOpen(false)}
                  >
                    <Calculator className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Cost Calculator</div>
                      <div className="text-xs text-gray-600">Calculate running costs</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/signin">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
