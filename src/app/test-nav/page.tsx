"use client";

import Link from "next/link";

export default function TestNavPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Navigation Test</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Direct Links to Tools:</h2>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/parts-comparison"
            className="p-4 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            🛒 Parts Price Comparison
          </Link>

          <Link
            href="/vehicle-valuation"
            className="p-4 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            🧮 Vehicle Valuation
          </Link>

          <Link
            href="/car-comparison"
            className="p-4 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            🚗 Car Comparison
          </Link>

          <Link
            href="/tyre-shop-finder"
            className="p-4 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            🎯 Tyre Shop Finder
          </Link>

          <Link
            href="/maintenance"
            className="p-4 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            🔧 Maintenance Tracker
          </Link>

          <Link
            href="/cost-calculator"
            className="p-4 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            💰 Running Cost Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
