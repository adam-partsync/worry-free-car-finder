"use client";

import { useState } from 'react';

export default function MinimalSearchPage() {
  const [make, setMake] = useState('');
  const [budget, setBudget] = useState('');
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('MINIMAL TEST: Form submitted');
    console.log('MINIMAL TEST: Make:', make);
    console.log('MINIMAL TEST: Budget:', budget);

    setLoading(true);
    setResults('Testing...');

    try {
      const query = `${make} under £${budget}`.trim();
      console.log('MINIMAL TEST: Query:', query);

      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      console.log('MINIMAL TEST: Response:', data);

      if (response.ok) {
        setResults(`Success! Got ${data.listings?.length || 0} listings`);
      } else {
        setResults(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('MINIMAL TEST: Error:', error);
      setResults(`Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🧪 Minimal Search Test</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Make:</label>
          <br />
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            style={{ padding: '5px', width: '200px' }}
          >
            <option value="">Select Make</option>
            <option value="honda">Honda</option>
            <option value="toyota">Toyota</option>
            <option value="bmw">BMW</option>
            <option value="ford">Ford</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Budget:</label>
          <br />
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="15000"
            style={{ padding: '5px', width: '200px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Searching...' : 'Test Search'}
        </button>
      </form>

      {results && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <strong>Result:</strong> {results}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Open browser console (F12) to see detailed logs</p>
        <p>This page uses no external UI libraries - just basic HTML/React</p>
      </div>
    </div>
  );
}
