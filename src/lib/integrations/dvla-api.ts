import axios from 'axios';

const DVLA_API_BASE = 'https://driver-vehicle-licensing.api.gov.uk';
const MOT_API_BASE = 'https://beta.check-mot.service.gov.uk';

interface DVLAVehicleData {
  registrationNumber: string;
  make: string;
  model: string;
  colour: string;
  yearOfManufacture: number;
  engineCapacity: number;
  fuelType: string;
  euroStatus: string;
  dateOfLastV5CIssued: string;
  motStatus: string;
  motExpiryDate: string;
  wheelplan: string;
  monthOfFirstRegistration: string;
}

interface MOTTestResult {
  completedDate: string;
  testResult: string;
  expiryDate: string;
  odometerValue: string;
  odometerUnit: string;
  motTestNumber: string;
  defects: Array<{
    text: string;
    type: string;
    dangerous: boolean;
  }>;
}

export class DVLAAPIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.DVLA_MOT_API_KEY || '';
  }

  async getVehicleData(registration: string): Promise<DVLAVehicleData | null> {
    try {
      // Clean registration number
      const cleanReg = registration.replace(/\s+/g, '').toUpperCase();

      const response = await axios.post(
        `${DVLA_API_BASE}/vehicle-enquiry/v1/vehicles`,
        {
          registrationNumber: cleanReg
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data;
    } catch (error) {
      console.error('DVLA API error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null; // Vehicle not found
        }
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded');
        }
      }
      throw error;
    }
  }

  async getMOTHistory(registration: string): Promise<MOTTestResult[]> {
    try {
      const cleanReg = registration.replace(/\s+/g, '').toUpperCase();

      const response = await axios.get(
        `${MOT_API_BASE}/trade/vehicles/mot-tests`,
        {
          params: {
            registration: cleanReg
          },
          headers: {
            'x-api-key': this.apiKey,
            'Accept': 'application/json+v6'
          },
          timeout: 10000
        }
      );

      return response.data || [];
    } catch (error) {
      console.error('MOT API error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return []; // No MOT history found
        }
      }
      throw error;
    }
  }

  async getComprehensiveVehicleData(registration: string) {
    try {
      const [vehicleData, motHistory] = await Promise.all([
        this.getVehicleData(registration),
        this.getMOTHistory(registration)
      ]);

      if (!vehicleData) {
        return null;
      }

      return {
        vehicle: vehicleData,
        motHistory,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Comprehensive vehicle data error:', error);
      throw error;
    }
  }
}

// Vehicle history data providers integration
export class VehicleHistoryService {
  private hpiApiKey: string;
  private capApiKey: string;

  constructor() {
    this.hpiApiKey = process.env.HPI_API_KEY || '';
    this.capApiKey = process.env.CAP_API_KEY || '';
  }

  async getHPICheck(registration: string, vin?: string) {
    try {
      // HPI Check API integration
      const response = await axios.post(
        'https://api.hpicheck.com/vehicle/check',
        {
          registration,
          vin,
          checks: ['stolen', 'finance', 'writeoff', 'import', 'mileage']
        },
        {
          headers: {
            'Authorization': `Bearer ${this.hpiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      return response.data;
    } catch (error) {
      console.error('HPI API error:', error);
      throw error;
    }
  }

  async getCAPValuation(registration: string, mileage: number) {
    try {
      // CAP valuation API integration
      const response = await axios.post(
        'https://api.cap.co.uk/valuation/vehicle',
        {
          registration,
          mileage,
          condition: 'average'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.capApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data;
    } catch (error) {
      console.error('CAP API error:', error);
      throw error;
    }
  }

  async getInsuranceHistory(registration: string) {
    try {
      // Insurance database check (example using CUE database)
      const response = await axios.post(
        'https://api.insurancehistory.co.uk/claims',
        {
          registration
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.INSURANCE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Insurance API error:', error);
      // Return empty history if service unavailable
      return {
        totalClaims: 0,
        majorClaims: 0,
        claimHistory: []
      };
    }
  }

  async getComprehensiveHistoryCheck(registration: string, vin?: string) {
    try {
      const [hpiData, insuranceHistory] = await Promise.allSettled([
        this.getHPICheck(registration, vin),
        this.getInsuranceHistory(registration)
      ]);

      return {
        hpi: hpiData.status === 'fulfilled' ? hpiData.value : null,
        insurance: insuranceHistory.status === 'fulfilled' ? insuranceHistory.value : null,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Comprehensive history check error:', error);
      throw error;
    }
  }
}

// Market data integration
export class MarketDataService {
  private autotraderApiKey: string;

  constructor() {
    this.autotraderApiKey = process.env.AUTOTRADER_API_KEY || '';
  }

  async getMarketPrices(make: string, model: string, year: number, mileage: number) {
    try {
      const response = await axios.get(
        'https://api.autotrader.co.uk/market-data/prices',
        {
          params: {
            make,
            model,
            year,
            mileage_range: `${mileage - 5000}-${mileage + 5000}`,
            radius: 50
          },
          headers: {
            'Authorization': `Bearer ${this.autotraderApiKey}`,
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data;
    } catch (error) {
      console.error('AutoTrader API error:', error);
      throw error;
    }
  }

  async getDepreciationData(make: string, model: string, year: number) {
    try {
      const response = await axios.get(
        'https://api.cap.co.uk/depreciation/forecast',
        {
          params: {
            make,
            model,
            year,
            periods: '1,3,5' // 1, 3, and 5 year forecasts
          },
          headers: {
            'Authorization': `Bearer ${this.capApiKey}`,
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data;
    } catch (error) {
      console.error('CAP depreciation API error:', error);
      throw error;
    }
  }
}

// Fallback service when APIs are unavailable
export class FallbackDataService {
  static generateMockMOTData(registration: string) {
    // Generate realistic mock data for development/fallback
    return {
      registration: registration.toUpperCase(),
      make: 'TOYOTA',
      model: 'COROLLA',
      firstUsedDate: '2019-03-15',
      fuelType: 'Petrol',
      engineSize: '1198',
      colour: 'Silver',
      motTests: [
        {
          testDate: '2024-03-10',
          testResult: 'PASSED',
          expiryDate: '2025-03-09',
          odometerValue: 45230,
          odometerUnit: 'mi',
          motTestNumber: 'MOT123456789',
          defects: [
            {
              text: 'Nearside front tyre worn close to legal limit (5.2.3(e))',
              type: 'ADVISORY'
            }
          ]
        }
      ]
    };
  }

  static generateMockHPIData(registration: string) {
    return {
      registration: registration.toUpperCase(),
      stolen: { status: 'clear' },
      finance: { status: 'clear' },
      writeOff: { status: 'clear' },
      import: { status: 'uk_vehicle' },
      mileage: { status: 'consistent' },
      insurance: {
        totalClaims: Math.floor(Math.random() * 3),
        majorClaims: 0,
        lastClaimDate: '2021-08-15'
      }
    };
  }
}

// Main service that orchestrates all data sources
export class VehicleDataService {
  private dvlaService: DVLAAPIService;
  private historyService: VehicleHistoryService;
  private marketService: MarketDataService;

  constructor() {
    this.dvlaService = new DVLAAPIService();
    this.historyService = new VehicleHistoryService();
    this.marketService = new MarketDataService();
  }

  async getCompleteVehicleReport(registration: string, vin?: string, useRealAPIs = true) {
    try {
      if (!useRealAPIs || !process.env.DVLA_MOT_API_KEY) {
        // Use fallback data for development
        return {
          source: 'fallback',
          vehicle: FallbackDataService.generateMockMOTData(registration),
          history: FallbackDataService.generateMockHPIData(registration),
          timestamp: new Date().toISOString()
        };
      }

      // Use real APIs
      const [vehicleData, historyData] = await Promise.allSettled([
        this.dvlaService.getComprehensiveVehicleData(registration),
        this.historyService.getComprehensiveHistoryCheck(registration, vin)
      ]);

      return {
        source: 'api',
        vehicle: vehicleData.status === 'fulfilled' ? vehicleData.value : null,
        history: historyData.status === 'fulfilled' ? historyData.value : null,
        timestamp: new Date().toISOString(),
        errors: [
          vehicleData.status === 'rejected' ? vehicleData.reason : null,
          historyData.status === 'rejected' ? historyData.reason : null
        ].filter(Boolean)
      };
    } catch (error) {
      console.error('Complete vehicle report error:', error);
      throw error;
    }
  }
}
