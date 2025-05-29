'use client'

import { useState } from 'react'

interface CarListing {
  id: string
  title: string
  price: number
  year: number | null
  mileage: number | null
  location: string | null
  seller: string
  image: string
}

export default function CleanSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CarListing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim() || loading) return

    setLoading(true)
    setError('')
    setResults([])

    try {
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.vehicles && Array.isArray(data.vehicles)) {
        setResults(data.vehicles)
      } else {
        setError('No vehicles found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚗 Clean Car Search
          </h1>
          <p className="text-gray-600">
            Testing with minimal dependencies - bypassing all complex UI libraries
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8 text-center">
          <div className="inline-flex gap-2 items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., sporty car under £15000"
              className="px-4 py-3 border-2 border-gray-300 rounded-lg text-base w-80 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-base font-semibold text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-gray-600">Quick examples:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {[
              'Budget car under £5000',
              'Sporty 2 seater',
              'Family SUV',
              'First car for teenager'
            ].map((example) => (
              <button
                key={example}
                onClick={() => setQuery(example)}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm hover:bg-gray-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600 mb-2">🔍 Searching for cars...</div>
            <div className="text-gray-500">Please wait while we find the best vehicles for you</div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Found {results.length} vehicles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((car) => (
                <div key={car.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=200&fit=crop'
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {car.title}
                    </h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-green-600">
                        £{car.price?.toLocaleString() || 'N/A'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {car.year} • {car.mileage?.toLocaleString() || 'N/A'} miles
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      <div>{car.location}</div>
                      <div>{car.seller}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 p-6 bg-white border border-gray-200 rounded-lg text-center text-gray-600">
          <p className="font-semibold">Clean Search Interface</p>
          <p>Uses only Tailwind CSS classes • No Radix UI • No complex dependencies</p>
          <p className="mt-2">🔍 Direct API integration with UK car platforms</p>
        </div>
      </div>
    </div>
  )
}
