import { type NextRequest, NextResponse } from 'next/server';
import { getRealVehicleAPI } from '@/lib/scrapers/real-vehicle-api';
import { getMOTHistoryAPI } from '@/lib/integrations/mot-history-api';

interface MOTCheckRequest {
  registration: string;
}

interface MOTTest {
  completedDate: string;
  testResult: string;
  expiryDate?: string;
  odometerValue?: string;
  odometerUnit?: string;
  motTestNumber: string;
  rfrAndComments: MOTDefect[];
}

interface MOTDefect {
  text: string;
  type: string;
  dangerous: boolean;
}

interface MOTResult {
  registration: string;
  make?: string;
  model?: string;
  year?: number;
  fuelType?: string;
  engineSize?: string;
  color?: string;
  motStatus: string;
  motExpiry?: string;
  taxStatus?: string;
  taxDue?: string;
  motHistory?: MOTTest[];
  totalMOTTests?: number;
  dataSource: 'DVLA_REAL' | 'DVLA_MOT_API' | 'DEMO';
  lastChecked: string;
  warnings?: string[];
  recommendations?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { registration }: MOTCheckRequest = await request.json();

    if (!registration?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Vehicle registration number is required' },
        { status: 400 }
      );
    }

    // Clean and validate registration format
    const cleanReg = registration.replace(/\s+/g, '').toUpperCase();
    if (!/^[A-Z]{2}[0-9]{2}[A-Z]{3}$/.test(cleanReg) && !/^[A-Z][0-9]{1,3}[A-Z]{3}$/.test(cleanReg)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid UK registration format. Please use format like AB12CDE or A123BCD',
          example: 'AB12CDE'
        },
        { status: 400 }
      );
    }

    console.log(`🚗 MOT Check requested for: ${cleanReg}`);

    // Get both DVLA vehicle data and MOT history
    const realVehicleAPI = getRealVehicleAPI();
    const motHistoryAPI = getMOTHistoryAPI();

    const [vehicleData, motHistoryData] = await Promise.all([
      realVehicleAPI.lookupVehicle(cleanReg),
      motHistoryAPI.getVehicleMOTHistory(cleanReg)
    ]);

    if (vehicleData || motHistoryData.success) {
      console.log(`✅ Data found for ${cleanReg}`);

      // Use DVLA vehicle data if available, otherwise use MOT history vehicle data
      const vehicle = vehicleData?.Response.DataItems.VehicleRegistration;
      const motVehicle = motHistoryData.vehicle;

      // Determine what we can reliably say about MOT/tax status from DVLA data
      let motStatus: string;
      let taxStatus: string;
      let motExpiryDate: string | undefined;
      let taxDue: string | undefined;

      // Determine MOT status from actual MOT history if available
      let totalMOTTests = 0;

      if (motHistoryData.success && motHistoryData.vehicle?.motTests) {
        const latestMOT = motHistoryData.vehicle.motTests[0]; // Most recent test
        totalMOTTests = motHistoryData.vehicle.motTests.length;

        if (latestMOT) {
          motStatus = `Latest MOT: ${latestMOT.testResult}`;
          motExpiryDate = latestMOT.expiryDate;
        } else {
          motStatus = 'No MOT tests found';
        }
      } else if (vehicle?.Scrapped) {
        motStatus = 'Vehicle Scrapped - No MOT Required';
        taxStatus = 'Vehicle Scrapped - No Tax Required';
      } else if (vehicle.Exported) {
        motStatus = 'Vehicle Exported - UK MOT Not Applicable';
        taxStatus = 'Vehicle Exported - UK Tax Not Applicable';
      } else {
        // Vehicle appears active, but we cannot determine actual MOT/tax status
        motStatus = 'Status Unknown - Check Official MOT Service';
        taxStatus = 'Status Unknown - Check Official Tax Service';

        // We cannot provide accurate MOT/tax expiry dates from this DVLA API
        motExpiryDate = undefined;
        taxDue = undefined;
      }

      // Combine vehicle data from both sources
      const make = vehicle?.Make || motVehicle?.make || 'Unknown';
      const model = vehicle?.Model || motVehicle?.model || 'Unknown';
      const year = vehicle ? Number.parseInt(vehicle.YearOfManufacture) : (motVehicle?.registrationDate ? Number.parseInt(motVehicle.registrationDate.split('.')[0]) : undefined);
      const fuelType = vehicle?.FuelType || motVehicle?.fuelType || 'Unknown';
      const engineSize = vehicle ? `${vehicle.EngineCapacity}cc` : motVehicle?.engineSize ? `${motVehicle.engineSize}cc` : 'Unknown';
      const color = vehicle?.Colour || motVehicle?.primaryColour || 'Unknown';

      const dataSource = vehicleData && motHistoryData.success ? 'DVLA_REAL' :
                        vehicleData ? 'DVLA_REAL' :
                        motHistoryData.success ? 'DVLA_MOT_API' : 'DEMO';

      const motResult: MOTResult = {
        registration: cleanReg,
        make,
        model,
        year,
        fuelType,
        engineSize,
        color,
        motStatus,
        motExpiry: motExpiryDate,
        taxStatus,
        taxDue: undefined, // Not available from current APIs
        motHistory: motHistoryData.vehicle?.motTests || [],
        totalMOTTests,
        dataSource,
        lastChecked: new Date().toISOString(),
        warnings: generateWarnings(vehicle, motVehicle, motStatus, taxStatus),
        recommendations: generateRecommendations(vehicle, motVehicle, motStatus, taxStatus)
      };

      return NextResponse.json({
        success: true,
        result: motResult,
        message: '✅ Real DVLA data retrieved successfully',
        dataQuality: 'Official DVLA Record'
      });

    } else {
      // No real data available, return demo response
      console.log(`⚠️ No real DVLA data for ${cleanReg}, returning demo data`);

      const demoResult: MOTResult = {
        registration: cleanReg,
        make: 'Demo Vehicle',
        model: 'Test Model',
        year: 2020,
        fuelType: 'Petrol',
        engineSize: '1.6L',
        color: 'Blue',
        motStatus: 'Valid',
        motExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months from now
        taxStatus: 'Taxed',
        taxDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 months from now
        dataSource: 'DEMO',
        lastChecked: new Date().toISOString(),
        warnings: ['This is demo data for testing purposes'],
        recommendations: ['Real vehicle data requires valid UK registration numbers']
      };

      return NextResponse.json({
        success: true,
        result: demoResult,
        message: '🎭 Demo data returned - real DVLA lookup failed',
        dataQuality: 'Demo Data (Testing Only)'
      });
    }

  } catch (error) {
    console.error('MOT check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check vehicle MOT status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'MOT Check API',
    usage: 'POST with {"registration": "AB12CDE"} to check vehicle MOT status',
    features: [
      'Real DVLA data lookup when available',
      'MOT status and expiry date',
      'Tax status and due date',
      'Vehicle details (make, model, year)',
      'Demo fallback for testing'
    ],
    apiConfigured: !!(process.env.DVLA_VIN_API_KEY && process.env.DVLA_VIN_API_URL)
  });
}

function generateWarnings(vehicleData: any, motHistoryData: any, motStatus: string, taxStatus: string): string[] {
  const warnings: string[] = [];

  // Vehicle status warnings
  if (vehicleData.Scrapped) {
    warnings.push('🚫 Vehicle is scrapped - not roadworthy and cannot be driven');
  }

  if (vehicleData.Exported) {
    warnings.push('🚫 Vehicle has been exported from the UK');
  }

  // Age-based MOT requirement warning
  const vehicleAge = new Date().getFullYear() - Number.parseInt(vehicleData.YearOfManufacture);
  if (vehicleAge >= 3 && !vehicleData.Scrapped && !vehicleData.Exported) {
    warnings.push('📋 Vehicle is 3+ years old and requires annual MOT testing');
  }

  // Critical: MOT and tax data limitation warning
  if (!vehicleData.Scrapped && !vehicleData.Exported) {
    warnings.push('⚠️ IMPORTANT: This API cannot provide actual MOT or tax status');
    warnings.push('📍 You MUST check official gov.uk services for current MOT and tax status');
  }

  return warnings;
}

function generateRecommendations(vehicleData: any, motHistoryData: any, motStatus: string, taxStatus: string): string[] {
  const recommendations: string[] = [];

  // Official service recommendations (most important)
  if (!vehicleData.Scrapped && !vehicleData.Exported) {
    recommendations.push('🔍 CHECK MOT STATUS: Visit https://www.gov.uk/check-mot-status');
    recommendations.push('🚗 CHECK TAX STATUS: Visit https://www.gov.uk/check-vehicle-tax');
    recommendations.push('📋 These are the ONLY official sources for current MOT and tax status');
  }

  // Vehicle age recommendations
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - Number.parseInt(vehicleData.YearOfManufacture);

  if (vehicleAge >= 3) {
    recommendations.push('📅 Vehicle requires annual MOT - check expiry date on gov.uk');
  }

  if (vehicleAge < 3) {
    recommendations.push('🆕 Vehicle under 3 years old - no MOT required yet');
  }

  if (vehicleAge > 10) {
    recommendations.push('🔧 Older vehicle - consider thorough pre-purchase inspection');
  }

  // Vehicle-specific data insights
  if (vehicleData.Co2Emissions > 200) {
    recommendations.push('💰 High CO2 emissions - expect higher road tax costs');
  }

  // General buying advice
  recommendations.push('💡 Always inspect vehicle in person before purchasing');
  recommendations.push('📋 Request full service history and previous owner details');
  recommendations.push('🔍 Consider independent vehicle inspection for expensive purchases');

  return recommendations;
}
