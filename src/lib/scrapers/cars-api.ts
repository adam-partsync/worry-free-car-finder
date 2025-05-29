export interface CarListing {
  id: string;
  title: string;
  price: number;
  year: number | null;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  location: string | null;
  seller: string;
  rating: number;
  image: string;
  features: string[];
  url?: string;
  bodyType?: string | null;
  engineSize?: string | null;
  doors?: number | null;
  condition?: string | null;
  listingDate?: string;
}

interface SearchFilters {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  fuelType?: string;
  transmission?: string;
  postcode?: string;
  radius?: number;
}

export class CarsApiScraper {
  private baseUrl = 'https://www.cars.co.uk';

  async searchCars(filters: SearchFilters, maxResults = 20): Promise<CarListing[]> {
    try {
      console.log('Searching Cars.co.uk with filters:', filters);

      // For now, return realistic mock data that matches the filters
      // In production, this would make HTTP requests to cars.co.uk API
      return this.generateRealisticListings(filters, maxResults);

    } catch (error) {
      console.error('Cars.co.uk API error:', error);
      return [];
    }
  }

  private generateRealisticListings(filters: SearchFilters, maxResults: number): CarListing[] {
    const listings: CarListing[] = [];
    const budget = filters.maxPrice || 25000;
    const make = filters.make || 'Various';

    // Common UK car makes and models
    const carData = {
      Toyota: ['Corolla', 'Yaris', 'Auris', 'Prius', 'RAV4', 'Camry'],
      Honda: ['Civic', 'Jazz', 'CR-V', 'Accord', 'HR-V', 'Insight'],
      Ford: ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'EcoSport', 'Mustang'],
      Volkswagen: ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc', 'Arteon'],
      BMW: ['1 Series', '3 Series', 'X1', 'X3', 'i3', 'Z4'],
      Audi: ['A3', 'A4', 'Q3', 'TT', 'A1', 'Q5'],
      Mercedes: ['A-Class', 'C-Class', 'GLA', 'E-Class', 'CLA'],
      Nissan: ['Micra', 'Qashqai', 'Juke', 'Leaf', 'Note'],
      Mazda: ['MX-5', 'CX-5', '3', '6', 'CX-3'],
      Hyundai: ['i30', 'Tucson', 'i20', 'Kona', 'Santa Fe']
    };

    const locations = [
      'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool',
      'Bristol', 'Leeds', 'Sheffield', 'Edinburgh', 'Leicester',
      'Coventry', 'Bradford', 'Cardiff', 'Belfast', 'Nottingham'
    ];

    const dealers = [
      'AutoNation UK', 'CarMax Motors', 'Premier Vehicle Sales',
      'Elite Car Centre', 'Honest John Motors', 'Drive Away Today',
      'Quality Used Cars', 'Motorpoint', 'Arnold Clark', 'Lookers'
    ];

    // Generate realistic listings
    for (let i = 0; i < Math.min(maxResults, 15); i++) {
      const makes = Object.keys(carData);
      const selectedMake = filters.make || makes[Math.floor(Math.random() * makes.length)];
      const models = carData[selectedMake as keyof typeof carData] || ['Model'];
      const selectedModel = filters.model || models[Math.floor(Math.random() * models.length)];

      // Generate realistic pricing within budget
      const basePrice = budget * (0.4 + Math.random() * 0.5);
      const year = filters.minYear ? Math.max(filters.minYear, 2012) + Math.floor(Math.random() * (2024 - (filters.minYear || 2012))) : 2016 + Math.floor(Math.random() * 8);
      const mileage = Math.floor(15000 + Math.random() * 80000);

      // Adjust price based on year and mileage
      const ageFactor = Math.max(0.5, 1 - (2024 - year) * 0.08);
      const mileageFactor = Math.max(0.6, 1 - (mileage / 100000) * 0.3);
      const finalPrice = Math.round(basePrice * ageFactor * mileageFactor);

      // Skip if outside price range
      if (filters.minPrice && finalPrice < filters.minPrice) continue;
      if (filters.maxPrice && finalPrice > filters.maxPrice) continue;
      if (filters.maxMileage && mileage > filters.maxMileage) continue;

      const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
      const transmissions = ['Manual', 'Automatic'];
      const bodyTypes = ['Hatchback', 'Saloon', 'Estate', 'SUV', 'Convertible', 'Coupe'];

      const fuelType = filters.fuelType || fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
      const transmission = filters.transmission || transmissions[Math.floor(Math.random() * transmissions.length)];
      const bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];

      const listing: CarListing = {
        id: `cars_api_${i + 1}`,
        title: `${year} ${selectedMake} ${selectedModel} ${bodyType} ${transmission}`,
        price: finalPrice,
        year,
        mileage,
        fuelType,
        transmission,
        location: filters.postcode ? `Near ${filters.postcode}` : locations[Math.floor(Math.random() * locations.length)],
        seller: dealers[Math.floor(Math.random() * dealers.length)],
        rating: 4.0 + Math.random() * 1.0,
        image: `https://images.unsplash.com/photo-${1558618047 + i * 1000}?w=400&h=250&fit=crop&auto=format`,
        features: this.generateFeatures(selectedMake, year),
        url: `https://www.cars.co.uk/used-cars/${selectedMake.toLowerCase()}-${selectedModel.toLowerCase()}-${i}`,
        bodyType,
        engineSize: this.getEngineSize(selectedMake, selectedModel),
        doors: bodyType === 'Convertible' ? 2 : 4,
        condition: 'Used',
        listingDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      listings.push(listing);
    }

    return listings.sort((a, b) => (a.price || 0) - (b.price || 0));
  }

  private generateFeatures(make: string, year: number): string[] {
    const baseFeatures = ['Air Conditioning', 'Electric Windows', 'Central Locking'];
    const modernFeatures = ['Bluetooth', 'USB Connectivity', 'DAB Radio', 'Parking Sensors'];
    const premiumFeatures = ['Sat Nav', 'Heated Seats', 'Cruise Control', 'Alloy Wheels'];
    const luxuryFeatures = ['Leather Seats', 'Sunroof', 'Keyless Entry', 'Premium Sound'];

    const features = [...baseFeatures];

    if (year >= 2015) {
      features.push(...modernFeatures.slice(0, 2));
    }

    if (['BMW', 'Audi', 'Mercedes', 'Lexus'].includes(make)) {
      features.push(...premiumFeatures.slice(0, 2));
      if (year >= 2018) {
        features.push(...luxuryFeatures.slice(0, 1));
      }
    }

    if (year >= 2020) {
      features.push('Apple CarPlay');
    }

    return features.slice(0, Math.min(6, features.length));
  }

  private getEngineSize(make: string, model: string): string {
    const engineSizes = {
      'Small': '1.0L',
      'Compact': '1.2L',
      'Standard': '1.6L',
      'Performance': '2.0L',
      'Luxury': '2.5L'
    };

    if (['Yaris', 'Micra', 'i20', '1 Series'].includes(model)) return engineSizes.Small;
    if (['Polo', 'Fiesta', 'Jazz'].includes(model)) return engineSizes.Compact;
    if (['3 Series', 'TT', 'MX-5'].includes(model)) return engineSizes.Performance;
    if (['E-Class', 'Q5', 'X3'].includes(model)) return engineSizes.Luxury;

    return engineSizes.Standard;
  }
}

// Singleton instance
let carsApiInstance: CarsApiScraper | null = null;

export function getCarsApiScraper(): CarsApiScraper {
  if (!carsApiInstance) {
    carsApiInstance = new CarsApiScraper();
  }
  return carsApiInstance;
}
