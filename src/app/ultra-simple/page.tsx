'use client'

import { useState } from 'react'

// Ultra-minimal car listing interface
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

export default function UltraSimplePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CarListing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return

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
      console.log('Search response:', data)

      if (data.vehicles && Array.isArray(data.vehicles)) {
        setResults(data.vehicles)
      } else {
        setError('No vehicles found')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1f2937', fontSize: '2rem', marginBottom: '10px' }}>
          🚗 Ultra Simple Car Search
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Basic search interface - no complex dependencies
        </p>
      </div>

      {/* Search Box */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., sporty car under £15000"
            style={{
              padding: '12px 16px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              width: '300px',
              outline: 'none'
            }}
            onFocus={(e) => { e.target.style.borderColor = '#3b82f6' }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Quick Examples */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <p style={{ marginBottom: '10px', color: '#6b7280' }}>Quick examples:</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            'Budget car under £5000',
            'Sporty 2 seater',
            'Family SUV',
            'First car for teenager'
          ].map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb' }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6' }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#1f2937' }}>
            Found {results.length} vehicles
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {results.map((car) => (
              <div key={car.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={car.image}
                  alt={car.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=200&fit=crop'
                  }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#1f2937'
                  }}>
                    {car.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#059669' }}>
                      £{car.price?.toLocaleString() || 'N/A'}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>
                      {car.year} • {car.mileage?.toLocaleString() || 'N/A'} miles
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>
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
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        <p>Ultra-minimal search interface • No complex dependencies • Pure React basics</p>
        <p>🔍 Search integrates with real UK car platforms via API</p>
      </div>
    </div>
  )
}
