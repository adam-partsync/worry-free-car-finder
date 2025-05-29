"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const carMakes = [
  "BMW", "Honda", "Toyota", "Ford", "Volkswagen", "Audi", "Mercedes-Benz"
];

export default function TestSearchPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    id: string;
    title: string;
    price: number;
    year: number;
    mileage?: number;
    location: string;
    seller: string;
    source?: string;
  }>>([]);
  const [formData, setFormData] = useState({
    make: '',
    budget: '',
    yearFrom: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🧪 TEST: Form submitted');
    console.log('🧪 TEST: Form data:', formData);

    setLoading(true);

    try {
      // Build query from form data
      const queryParts = [];
      if (formData.make) queryParts.push(formData.make);
      if (formData.budget) queryParts.push(`under £${formData.budget}`);
      if (formData.yearFrom) queryParts.push(`from ${formData.yearFrom}`);

      const query = queryParts.join(', ') || 'cars';

      console.log('🧪 TEST: Built query:', query);

      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      console.log('🧪 TEST: API Response:', data);

      if (response.ok && data.listings) {
        console.log('🧪 TEST: Got listings:', data.listings.length);
        setResults(data.listings);
      } else {
        throw new Error(data.error || 'Search failed');
      }

    } catch (error) {
      console.error('🧪 TEST: Error:', error);
      alert(`Search failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Search Test Page</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Simple Search Test</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Make</label>
                <Select value={formData.make} onValueChange={(value) => setFormData(prev => ({...prev, make: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {carMakes.map((make) => (
                      <SelectItem key={make} value={make.toLowerCase()}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget</label>
                <Input
                  type="number"
                  placeholder="15000"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({...prev, budget: e.target.value}))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Year From</label>
                <Input
                  type="number"
                  placeholder="2018"
                  value={formData.yearFrom}
                  onChange={(e) => setFormData(prev => ({...prev, yearFrom: e.target.value}))}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Searching...' : '🔍 Test Search'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Results ({results.length})</h2>
            <div className="grid gap-4">
              {results.map((car) => (
                <Card key={car.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{car.title}</h3>
                    <p className="text-lg font-bold text-green-600">£{car.price.toLocaleString()}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Year: {car.year} • Mileage: {car.mileage?.toLocaleString() || 'N/A'} miles</p>
                      <p>Location: {car.location} • Seller: {car.seller}</p>
                      {car.source && (
                        <p className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {car.source}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
