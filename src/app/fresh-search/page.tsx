'use client';

import { useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  seller: string;
  source: string;
}

interface ApiResponse {
  success: boolean;
  listings: SearchResult[];
  error?: string;
}

export default function FreshSearchPage() {
  const [make, setMake] = useState('');
  const [budget, setBudget] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const searchQuery = `I want a ${make || 'any'} car with budget up to £${budget || 'any'} from year ${yearFrom || 'any'}`;
      
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          budget: budget ? Number.parseInt(budget) : undefined,
          yearFrom: yearFrom ? Number.parseInt(yearFrom) : undefined,
          make: make || undefined,
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.listings) {
        setResults(data.listings);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Fresh Car Search</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="make" style={{ display: 'block', marginBottom: '5px' }}>
            Make:
          </label>
          <select
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            style={{ 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              width: '200px'
            }}
          >
            <option value="">Any Make</option>
            <option value="Honda">Honda</option>
            <option value="Toyota">Toyota</option>
            <option value="BMW">BMW</option>
            <option value="Ford">Ford</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="budget" style={{ display: 'block', marginBottom: '5px' }}>
            Budget (£):
          </label>
          <input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 15000"
            style={{ 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              width: '200px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="yearFrom" style={{ display: 'block', marginBottom: '5px' }}>
            Year From:
          </label>
          <input
            id="yearFrom"
            type="number"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            placeholder="e.g. 2018"
            style={{ 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              width: '200px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'default' : 'pointer'
          }}
        >
          {loading ? 'Searching...' : 'Search Cars'}
        </button>
      </form>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          border: '1px solid #f44336',
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#c62828'
        }}>
          Error: {error}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '15px' }}>Search Results ({results.length} cars found)</h2>
          {results.map((car) => (
            <div
              key={car.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{car.title}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div><strong>Price:</strong> £{car.price.toLocaleString()}</div>
                <div><strong>Year:</strong> {car.year}</div>
                <div><strong>Mileage:</strong> {car.mileage.toLocaleString()} miles</div>
                <div><strong>Location:</strong> {car.location}</div>
                <div><strong>Seller:</strong> {car.seller}</div>
                <div><strong>Source:</strong> {car.source}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#666',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          Enter your search criteria above to find cars
        </div>
      )}
    </div>
  );
}