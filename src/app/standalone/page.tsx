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

export default function StandalonePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CarListing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px'
    },
    title: {
      color: '#1f2937',
      fontSize: '2rem',
      marginBottom: '10px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1rem'
    },
    searchBox: {
      marginBottom: '30px',
      textAlign: 'center' as const
    },
    searchForm: {
      display: 'inline-flex',
      gap: '10px',
      alignItems: 'center'
    },
    input: {
      padding: '12px 16px',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      width: '300px',
      outline: 'none'
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    error: {
      padding: '16px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      marginBottom: '20px',
      textAlign: 'center' as const
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    card: {
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover' as const
    },
    cardContent: {
      padding: '16px'
    },
    cardTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#1f2937'
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    price: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#059669'
    },
    details: {
      color: '#6b7280',
      fontSize: '14px'
    }
  }

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
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🚗 Standalone Car Search</h1>
        <p style={styles.subtitle}>Independent layout - no global dependencies</p>
      </div>

      <div style={styles.searchBox}>
        <div style={styles.searchForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g., sporty car under £15000"
            style={styles.input}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h2 style={{fontSize: '1.5rem', marginBottom: '20px', color: '#1f2937'}}>
            Found {results.length} vehicles
          </h2>
          <div style={styles.grid}>
            {results.map((car) => (
              <div key={car.id} style={styles.card}>
                <img
                  src={car.image}
                  alt={car.title}
                  style={styles.image}
                />
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>
                    {car.title}
                  </h3>
                  <div style={styles.priceRow}>
                    <span style={styles.price}>
                      £{car.price?.toLocaleString() || 'N/A'}
                    </span>
                    <span style={styles.details}>
                      {car.year} • {car.mileage?.toLocaleString() || 'N/A'} miles
                    </span>
                  </div>
                  <div style={styles.details}>
                    <div>{car.location}</div>
                    <div>{car.seller}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
