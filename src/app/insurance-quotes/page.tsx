"use client";

import { Car } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InsuranceQuoteComparison from "@/components/tools/InsuranceQuoteComparison";

export default function InsuranceQuotesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Worry Free Car Finder
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/why-choose" className="text-gray-600 hover:text-gray-900 transition-colors">
                  How We Make Car Buying Easier
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Search Cars
                </Link>
                <Link href="/tools" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tools
                </Link>
                <Link href="/help-me-choose" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Help Me Choose
                </Link>
              </nav>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button size="sm">Get Started</Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <InsuranceQuoteComparison />
        </div>
      </div>
    </div>
  );
}
