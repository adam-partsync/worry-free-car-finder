"use client";

import { useState } from 'react';

export default function WorkingSearchPage() {
  const [formData, setFormData] = useState({
    make: '',
    budget: '',
    year: ''
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🟢 FORM SUBMITTED');
    console.log('🟢 Form Data:', formData);

    if (!formData.make && !formData.budget) {
      alert('Please fill in at least Make or Budget');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const queryParts = [];
      if (formData.make) queryParts.push(formData.make);
      if (formData.budget) queryParts.push(`under £${formData.budget}`);
      if (formData.year) queryParts.push(`from ${formData.year}`);

      const query = queryParts.join(', ');
      console.log('🟢 API Query:', query);

      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('🟢 API Response Status:', response.status);

      const data = await response.json();
      console.log('🟢 API Response Data:', data);

      if (response.ok && data.listings) {
        setResults(data.listings);
        console.log('🟢 SUCCESS: Got', data.listings.length, 'listings');
      } else {
        throw new Error(data.error || 'Search failed');
      }

    } catch (err) {
      console.error('🔴 ERROR:', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#2563eb', marginBottom: '30px' }}>
        🚗 Car Search (Working Version)
      </h1>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Make:
          </label>
          <select
            value={formData.make}
            onChange={(e) => handleInputChange('make', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="">Select Make</option>
            <option value="Honda">Honda</option>
            <option value="Toyota">Toyota</option>
            <option value="BMW">BMW</option>
            <option value="Ford">Ford</option>
            <option value="Volkswagen">Volkswagen</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Budget (£):
          </label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            placeholder="15000"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Year From:
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            placeholder="2018"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#94a3b8' : '#2563eb',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? '🔄 Searching...' : '🔍 Search Cars'}
        </button>
      </form>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h2 style={{ color: '#059669', marginBottom: '20px' }}>
            ✅ Found {results.length} Vehicles
          </h2>

          <div style={{ display: 'grid', gap: '15px' }}>
            {results.map((car, index) => (
              <div
                key={car.id || index}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '15px'
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>
                  {car.title}
                </h3>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#059669',
                  marginBottom: '10px'
                }}>
                  £{car.price?.toLocaleString() || 'N/A'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.4'
                }}>
                  <div>📅 {car.year} • 🛣️ {car.mileage?.toLocaleString() || 'N/A'} miles</div>
                  <div>📍 {car.location} • 🏪 {car.seller}</div>
                  {car.source && (
                    <div style={{
                      marginTop: '8px',
                      display: 'inline-block',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {car.source}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '30px',
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        <p>✅ This page uses zero external UI libraries</p>
        <p>🔧 Open browser console (F12) to see detailed logs</p>
        <p>🎯 Multi-platform search: AutoTrader • PistonHeads • Motors.co.uk • Cars.co.uk • eBay</p>
      </div>
    </div>
  );
}
