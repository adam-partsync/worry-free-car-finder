interface MOTTest {
  completedDate: string;
  testResult: string;
  expiryDate?: string;
  odometerValue?: string;
  odometerUnit?: string;
  odometerResultType?: string;
  motTestNumber: string;
  rfrAndComments: MOTDefect[];
}

interface MOTDefect {
  text: string;
  type: string; // FAIL, ADVISORY, MAJOR, DANGEROUS, USER ENTERED
  dangerous: boolean;
}

interface MOTHistoryVehicle {
  registration: string;
  make: string;
  model: string;
  firstUsedDate?: string;
  fuelType?: string;
  primaryColour?: string;
  vehicleId: string;
  registrationDate?: string;
  manufactureDate?: string;
  engineSize?: string;
  motTests: MOTTest[];
}

interface MOTHistoryResponse {
  success: boolean;
  vehicle?: MOTHistoryVehicle;
  message: string;
  dataSource: 'DVLA_MOT_API' | 'DEMO';
  lastChecked: string;
}

export class MOTHistoryAPI {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    // The official MOT History API requires registration and approval
    this.apiKey = process.env.MOT_HISTORY_API_KEY || '';
    this.baseUrl = process.env.MOT_HISTORY_API_URL || 'https://beta.check-mot.service.gov.uk';
  }

  async getVehicleMOTHistory(registration: string): Promise<MOTHistoryResponse> {
    if (!this.apiKey) {
      console.warn('MOT History API key not configured');
      return this.generateDemoMOTHistory(registration);
    }

    try {
      console.log(`🔍 Fetching MOT history for: ${registration}`);

      const response = await fetch(`${this.baseUrl}/trade/vehicles/mot-tests?registration=${registration}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json+v6',
          'x-api-key': this.apiKey,
          'User-Agent': 'WorryFreeCarFinder/1.0'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`⚠️ No MOT history found for ${registration}`);
          return {
            success: false,
            message: 'No MOT history found for this vehicle',
            dataSource: 'DVLA_MOT_API',
            lastChecked: new Date().toISOString()
          };
        }

        throw new Error(`MOT History API error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const vehicleData = data[0] as MOTHistoryVehicle;

        console.log(`✅ Real MOT history found for ${registration}: ${vehicleData.motTests.length} tests`);

        return {
          success: true,
          vehicle: vehicleData,
          message: '✅ Official MOT history retrieved successfully',
          dataSource: 'DVLA_MOT_API',
          lastChecked: new Date().toISOString()
        };
      }

      return {
        success: false,
        message: 'No MOT data in response',
        dataSource: 'DVLA_MOT_API',
        lastChecked: new Date().toISOString()
      };

    } catch (error) {
      console.error(`MOT History API failed for ${registration}:`, error);
      return this.generateDemoMOTHistory(registration);
    }
  }

  private generateDemoMOTHistory(registration: string): MOTHistoryResponse {
    console.log(`🎭 Generating demo MOT history for ${registration}`);

    // Generate realistic demo MOT history
    const currentYear = new Date().getFullYear();
    const vehicleAge = Math.floor(Math.random() * 10) + 3; // 3-13 years old
    const vehicleYear = currentYear - vehicleAge;

    const motTests: MOTTest[] = [];

    // Generate MOT history (annual tests for vehicles 3+ years old)
    for (let i = 0; i < vehicleAge - 2; i++) {
      const testYear = currentYear - i;
      const testDate = new Date(testYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const expiryDate = new Date(testDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const testResult = Math.random() > 0.2 ? 'PASSED' : 'FAILED';
      const mileage = 15000 + (vehicleAge - i) * 12000 + Math.floor(Math.random() * 5000);

      const test: MOTTest = {
        completedDate: testDate.toISOString().replace('T', ' ').split('.')[0],
        testResult,
        expiryDate: testResult === 'PASSED' ? expiryDate.toISOString().split('T')[0] : undefined,
        odometerValue: mileage.toString(),
        odometerUnit: 'mi',
        odometerResultType: 'READ',
        motTestNumber: `${Math.floor(Math.random() * 900000000) + 100000000}`,
        rfrAndComments: testResult === 'FAILED' ? this.generateMOTDefects() : []
      };

      motTests.push(test);
    }

    const demoVehicle: MOTHistoryVehicle = {
      registration: registration.toUpperCase(),
      make: 'DEMO',
      model: 'TEST VEHICLE',
      firstUsedDate: `${vehicleYear}.01.15`,
      fuelType: 'Petrol',
      primaryColour: 'Blue',
      vehicleId: `demo_${registration.toLowerCase()}`,
      registrationDate: `${vehicleYear}.01.15`,
      manufactureDate: `${vehicleYear}.01.01`,
      engineSize: '1600',
      motTests: motTests.reverse() // Most recent first
    };

    return {
      success: true,
      vehicle: demoVehicle,
      message: '🎭 Demo MOT history generated - real API requires registration',
      dataSource: 'DEMO',
      lastChecked: new Date().toISOString()
    };
  }

  private generateMOTDefects(): MOTDefect[] {
    const commonDefects = [
      { text: 'Brake disc worn, pitted or scored', type: 'FAIL', dangerous: false },
      { text: 'Tyre tread depth below minimum', type: 'MAJOR', dangerous: false },
      { text: 'Headlamp aim too high or too low', type: 'MAJOR', dangerous: false },
      { text: 'Exhaust emissions above limits', type: 'FAIL', dangerous: false },
      { text: 'Suspension arm ball joint dust cover damaged', type: 'ADVISORY', dangerous: false },
      { text: 'Battery insecure', type: 'MINOR', dangerous: false }
    ];

    const numDefects = Math.floor(Math.random() * 3) + 1;
    const selectedDefects = [];

    for (let i = 0; i < numDefects; i++) {
      const defect = commonDefects[Math.floor(Math.random() * commonDefects.length)];
      selectedDefects.push({
        ...defect,
        text: `${defect.text} (${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10) + 1})`
      });
    }

    return selectedDefects;
  }
}

// Singleton instance
let motHistoryApiInstance: MOTHistoryAPI | null = null;

export function getMOTHistoryAPI(): MOTHistoryAPI {
  if (!motHistoryApiInstance) {
    motHistoryApiInstance = new MOTHistoryAPI();
  }
  return motHistoryApiInstance;
}
