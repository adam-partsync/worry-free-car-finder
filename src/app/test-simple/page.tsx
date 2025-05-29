"use client";

import Link from "next/link";

export default function TestSimplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Simplified Header Test</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test the Tools Dropdown</h2>
        <p className="text-gray-600 mb-4">
          Click on "Tools" in the header above to see if the dropdown appears with the Parts Price Comparison tool.
        </p>

        <div className="space-y-2">
          <p><strong>✅ Expected:</strong> Tools dropdown should show 6 tools including Parts Price Comparison</p>
          <p><strong>🛒 Parts Price Comparison</strong> should be the first item in the dropdown</p>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Direct Links (fallback):</h3>
          <div className="space-y-2">
            <Link href="/parts-comparison" className="block text-blue-600 hover:underline">
              🛒 Parts Price Comparison (Direct Link)
            </Link>
            <Link href="/vehicle-valuation" className="block text-blue-600 hover:underline">
              🧮 Vehicle Valuation (Direct Link)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
