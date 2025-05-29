import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export interface CarListing {
  id: string;
  title: string;
  price: number;
  year: number | null;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  location: string | null;
  seller: {
    name: string;
    type: 'dealer' | 'private';
    feedback?: number;
    feedbackPercentage?: number;
  };
  images: string[];
  url: string;
  description: string;
  features: string[];
  bodyType: string | null;
  engineSize: string | null;
  doors: number | null;
  condition: string | null;
  listingDate: string;
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
  sortBy?: 'price_asc' | 'price_desc' | 'date_desc' | 'mileage_asc';
}

export class EbayScraper {
  private browser: puppeteer.Browser | null = null;

  private async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  async searchCars(filters: SearchFilters, maxResults = 50): Promise<CarListing[]> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Build search URL
      const searchUrl = this.buildSearchUrl(filters);
      console.log('Searching eBay:', searchUrl);

      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait for listings to load
      await page.waitForSelector('.srp-results', { timeout: 10000 });

      // Get page content
      const content = await page.content();
      const $ = cheerio.load(content);

      const listings: CarListing[] = [];

      // Parse listings
      $('.srp-item').each((index, element) => {
        if (index >= maxResults) return false;

        try {
          const listing = this.parseCarListing($, element);
          if (listing) {
            listings.push(listing);
          }
        } catch (error) {
          console.error('Error parsing listing:', error);
        }
      });

      return listings;
    } catch (error) {
      console.error('Error scraping eBay:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  private buildSearchUrl(filters: SearchFilters): string {
    const baseUrl = 'https://www.ebay.co.uk/sch/i.html';
    const params = new URLSearchParams();

    // Category for cars
    params.append('_nkw', `${filters.make || ''} ${filters.model || ''} car`.trim());
    params.append('_sacat', '9801'); // Cars category

    // Price filters
    if (filters.minPrice) {
      params.append('_udlo', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params.append('_udhi', filters.maxPrice.toString());
    }

    // Location
    if (filters.postcode && filters.radius) {
      params.append('_sadis', filters.radius.toString());
      params.append('_stpos', filters.postcode);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price_asc':
        params.append('_sop', '15');
        break;
      case 'price_desc':
        params.append('_sop', '16');
        break;
      case 'date_desc':
        params.append('_sop', '10');
        break;
      case 'mileage_asc':
        params.append('_sop', '12');
        break;
    }

    return `${baseUrl}?${params.toString()}`;
  }

  private parseCarListing($: cheerio.CheerioAPI, element: cheerio.Element): CarListing | null {
    const $item = $(element);

    // Skip if not a valid car listing
    const title = $item.find('.s-item__title').text().trim();
    if (!title || title.toLowerCase().includes('watch') || title.toLowerCase().includes('parts')) {
      return null;
    }

    // Extract basic info
    const id = $item.attr('data-view') || Math.random().toString(36);
    const url = $item.find('.s-item__link').attr('href') || '';
    const priceText = $item.find('.s-item__price').text().replace(/[£,]/g, '');
    const price = Number.parseFloat(priceText) || 0;

    // Extract location
    const location = $item.find('.s-item__location').text().trim();

    // Extract seller info
    const sellerName = $item.find('.s-item__seller-info-text').text().trim() || 'Unknown';
    const sellerType = sellerName.toLowerCase().includes('ltd') ||
                      sellerName.toLowerCase().includes('limited') ||
                      sellerName.toLowerCase().includes('motors') ? 'dealer' : 'private';

    // Extract images
    const imageElement = $item.find('.s-item__image img');
    const imageUrl = imageElement.attr('src') || imageElement.attr('data-src') || '';
    const images = imageUrl ? [imageUrl] : [];

    // Extract additional details from title and description
    const details = this.extractCarDetails(title);

    return {
      id,
      title,
      price,
      year: details.year,
      mileage: details.mileage,
      fuelType: details.fuelType,
      transmission: details.transmission,
      location,
      seller: {
        name: sellerName,
        type: sellerType
      },
      images,
      url,
      description: title,
      features: details.features,
      bodyType: details.bodyType,
      engineSize: details.engineSize,
      doors: details.doors,
      condition: $item.find('.s-item__subtitle').text().includes('Used') ? 'Used' : 'Unknown',
      listingDate: new Date().toISOString().split('T')[0]
    };
  }

  private extractCarDetails(title: string): {
    year: number | null;
    mileage: number | null;
    fuelType: string | null;
    transmission: string | null;
    features: string[];
    bodyType: string | null;
    engineSize: string | null;
    doors: number | null;
  } {
    const titleLower = title.toLowerCase();

    // Extract year (4 digits)
    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? Number.parseInt(yearMatch[0]) : null;

    // Extract mileage
    const mileageMatch = title.match(/(\d+(?:,\d+)?)\s*(?:miles?|k)\b/i);
    let mileage: number | null = null;
    if (mileageMatch) {
      const mileageStr = mileageMatch[1].replace(/,/g, '');
      mileage = Number.parseInt(mileageStr);
      if (title.toLowerCase().includes('k') && mileage < 1000) {
        mileage *= 1000;
      }
    }

    // Extract fuel type
    let fuelType: string | null = null;
    if (titleLower.includes('petrol')) fuelType = 'Petrol';
    else if (titleLower.includes('diesel')) fuelType = 'Diesel';
    else if (titleLower.includes('hybrid')) fuelType = 'Hybrid';
    else if (titleLower.includes('electric') || titleLower.includes('ev')) fuelType = 'Electric';

    // Extract transmission
    let transmission: string | null = null;
    if (titleLower.includes('automatic') || titleLower.includes('auto')) transmission = 'Automatic';
    else if (titleLower.includes('manual')) transmission = 'Manual';

    // Extract body type
    let bodyType: string | null = null;
    if (titleLower.includes('hatchback')) bodyType = 'Hatchback';
    else if (titleLower.includes('saloon') || titleLower.includes('sedan')) bodyType = 'Saloon';
    else if (titleLower.includes('estate')) bodyType = 'Estate';
    else if (titleLower.includes('suv') || titleLower.includes('4x4')) bodyType = 'SUV';
    else if (titleLower.includes('convertible') || titleLower.includes('cabriolet')) bodyType = 'Convertible';
    else if (titleLower.includes('coupe')) bodyType = 'Coupe';

    // Extract engine size
    const engineMatch = title.match(/(\d+\.\d+)\s*l?(?:itre)?/i);
    const engineSize = engineMatch ? `${engineMatch[1]}L` : null;

    // Extract doors
    const doorsMatch = title.match(/(\d)\s*door/i);
    const doors = doorsMatch ? Number.parseInt(doorsMatch[1]) : null;

    // Extract features
    const features: string[] = [];
    const featureKeywords = [
      'air con', 'aircon', 'air conditioning',
      'sat nav', 'navigation', 'gps',
      'bluetooth',
      'cruise control',
      'parking sensors',
      'heated seats',
      'alloy wheels', 'alloys',
      'electric windows',
      'central locking',
      'abs', 'airbags'
    ];

    featureKeywords.forEach(keyword => {
      if (titleLower.includes(keyword)) {
        features.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });

    return {
      year,
      mileage,
      fuelType,
      transmission,
      features,
      bodyType,
      engineSize,
      doors
    };
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Singleton instance
let scraperInstance: EbayScraper | null = null;

export function getEbayScraper(): EbayScraper {
  if (!scraperInstance) {
    scraperInstance = new EbayScraper();
  }
  return scraperInstance;
}
