import { getEbayScraper, type CarListing } from './ebay-scraper';
import { getCarsApiScraper } from './cars-api';
import { getAutoTraderScraper } from './autotrader-scraper';
import { getPistonHeadsScraper } from './pistonheads-scraper';
import { getMotorsScraper } from './motors-scraper';

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
  searchType?: 'all' | 'budget' | 'premium' | 'performance';
}

export interface PlatformResult {
  platform: string;
  listings: CarListing[];
  searchTime: number;
  success: boolean;
  error?: string;
}

export class MultiPlatformScraper {
  private scrapers = {
    autotrader: getAutoTraderScraper(),
    pistonheads: getPistonHeadsScraper(),
    motors: getMotorsScraper(),
    cars: getCarsApiScraper(),
    ebay: getEbayScraper()
  };

  async searchAllPlatforms(filters: SearchFilters, maxResultsPerPlatform = 15): Promise<{
    allListings: CarListing[];
    platformResults: PlatformResult[];
    summary: {
      totalListings: number;
      platformsSearched: number;
      averagePrice: number;
      priceRange: { min: number; max: number };
      topSources: string[];
    };
  }> {
    console.log('🔍 Starting multi-platform search with filters:', filters);

    const platformResults: PlatformResult[] = [];
    const allListings: CarListing[] = [];

    // Determine which platforms to search based on criteria
    const platformsToSearch = this.selectPlatforms(filters);

    console.log(`🎯 Selected platforms: ${platformsToSearch.join(', ')}`);

    // Search platforms in parallel for speed
    const searchPromises = platformsToSearch.map(platform =>
      this.searchPlatform(platform, filters, maxResultsPerPlatform)
    );

    const results = await Promise.allSettled(searchPromises);

    results.forEach((result, index) => {
      const platform = platformsToSearch[index];

      if (result.status === 'fulfilled') {
        platformResults.push(result.value);
        allListings.push(...result.value.listings);
        console.log(`✅ ${platform}: ${result.value.listings.length} listings`);
      } else {
        platformResults.push({
          platform,
          listings: [],
          searchTime: 0,
          success: false,
          error: result.reason?.message || 'Unknown error'
        });
        console.error(`❌ ${platform}: ${result.reason?.message}`);
      }
    });

    // Remove duplicates and sort by relevance
    const uniqueListings = this.removeDuplicates(allListings);
    const sortedListings = this.sortByRelevance(uniqueListings, filters);

    // Generate summary
    const summary = this.generateSummary(sortedListings, platformResults);

    console.log(`🎉 Multi-platform search complete: ${summary.totalListings} total listings from ${summary.platformsSearched} platforms`);

    return {
      allListings: sortedListings,
      platformResults,
      summary
    };
  }

  private selectPlatforms(filters: SearchFilters): string[] {
    const platforms: string[] = [];
    const budget = filters.maxPrice || 50000;
    const searchType = filters.searchType || 'all';

    // Always include these core platforms
    platforms.push('autotrader', 'cars');

    // Add platform based on budget and search type
    if (searchType === 'performance' || this.isPerformanceCar(filters)) {
      platforms.push('pistonheads');
      console.log('🏎️ Added PistonHeads for performance cars');
    }

    if (searchType === 'budget' || budget < 15000) {
      platforms.push('motors', 'ebay');
      console.log('💰 Added Motors.co.uk and eBay for budget search');
    }

    if (searchType === 'premium' || budget > 25000) {
      platforms.unshift('autotrader'); // Prioritize AutoTrader for premium
      console.log('💎 Prioritizing AutoTrader for premium search');
    }

    if (searchType === 'all') {
      // Include all platforms for comprehensive search
      platforms.push('motors', 'pistonheads', 'ebay');
    }

    return [...new Set(platforms)]; // Remove duplicates
  }

  private isPerformanceCar(filters: SearchFilters): boolean {
    const performanceIndicators = [
      'sport', 'st', 'rs', 'gti', 'type r', 'm2', 'm3', 'm4', 'm5',
      'amg', 's line', 'r line', 'gt', 'turbo', 'coupe', 'convertible'
    ];

    const searchText = `${filters.make || ''} ${filters.model || ''}`.toLowerCase();
    return performanceIndicators.some(indicator => searchText.includes(indicator));
  }

  private async searchPlatform(
    platform: string,
    filters: SearchFilters,
    maxResults: number
  ): Promise<PlatformResult> {
    const startTime = Date.now();

    try {
      let listings: CarListing[] = [];

      switch (platform) {
        case 'autotrader':
          listings = await this.scrapers.autotrader.searchCars(filters, maxResults);
          break;
        case 'pistonheads':
          listings = await this.scrapers.pistonheads.searchCars(filters, maxResults);
          break;
        case 'motors':
          listings = await this.scrapers.motors.searchCars(filters, maxResults);
          break;
        case 'cars':
          listings = await this.scrapers.cars.searchCars(filters, maxResults);
          break;
        case 'ebay':
          // Convert filters to eBay format
          const ebayFilters = {
            make: filters.make,
            model: filters.model,
            maxPrice: filters.maxPrice,
            minYear: filters.minYear,
            maxYear: filters.maxYear,
            maxMileage: filters.maxMileage,
            fuelType: filters.fuelType,
            transmission: filters.transmission,
            postcode: filters.postcode,
            radius: filters.radius,
            sortBy: 'date_desc' as const
          };
          listings = await this.scrapers.ebay.searchCars(ebayFilters, maxResults);
          break;
        default:
          throw new Error(`Unknown platform: ${platform}`);
      }

      return {
        platform,
        listings,
        searchTime: Date.now() - startTime,
        success: true
      };

    } catch (error) {
      return {
        platform,
        listings: [],
        searchTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private removeDuplicates(listings: CarListing[]): CarListing[] {
    const seen = new Set<string>();
    return listings.filter(listing => {
      // Create a unique key based on title, price, and year
      const key = `${listing.title.toLowerCase()}-${listing.price}-${listing.year}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private sortByRelevance(listings: CarListing[], filters: SearchFilters): CarListing[] {
    return listings.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Price relevance (closer to max budget gets higher score)
      if (filters.maxPrice) {
        const priceFactorA = 1 - Math.abs(a.price - filters.maxPrice * 0.8) / filters.maxPrice;
        const priceFactorB = 1 - Math.abs(b.price - filters.maxPrice * 0.8) / filters.maxPrice;
        scoreA += priceFactorA * 40;
        scoreB += priceFactorB * 40;
      }

      // Year relevance (newer is better)
      if (a.year && b.year) {
        scoreA += (a.year - 2000) * 2;
        scoreB += (b.year - 2000) * 2;
      }

      // Mileage relevance (lower is better)
      if (a.mileage && b.mileage) {
        scoreA += Math.max(0, 100 - a.mileage / 1000);
        scoreB += Math.max(0, 100 - b.mileage / 1000);
      }

      // Source reliability bonus
      const sourceBonus = {
        'AutoTrader UK': 15,
        'PistonHeads': 12,
        'Cars.co.uk API': 10,
        'Motors.co.uk': 8,
        'eBay UK': 5
      };
      scoreA += sourceBonus[a.source as keyof typeof sourceBonus] || 0;
      scoreB += sourceBonus[b.source as keyof typeof sourceBonus] || 0;

      // Rating bonus
      scoreA += (a.rating || 4) * 3;
      scoreB += (b.rating || 4) * 3;

      return scoreB - scoreA;
    });
  }

  private generateSummary(listings: CarListing[], platformResults: PlatformResult[]) {
    const prices = listings.map(l => l.price).filter(p => p > 0);
    const successfulPlatforms = platformResults.filter(p => p.success);

    return {
      totalListings: listings.length,
      platformsSearched: successfulPlatforms.length,
      averagePrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
      priceRange: prices.length > 0 ? {
        min: Math.min(...prices),
        max: Math.max(...prices)
      } : { min: 0, max: 0 },
      topSources: [...new Set(listings.slice(0, 10).map(l => l.source).filter(Boolean))]
    };
  }
}

// Singleton instance
let multiPlatformScraperInstance: MultiPlatformScraper | null = null;

export function getMultiPlatformScraper(): MultiPlatformScraper {
  if (!multiPlatformScraperInstance) {
    multiPlatformScraperInstance = new MultiPlatformScraper();
  }
  return multiPlatformScraperInstance;
}
