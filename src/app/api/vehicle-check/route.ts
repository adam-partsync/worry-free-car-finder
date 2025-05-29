import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

interface VehicleCheckRequest {
  registration: string;
  vin?: string;
  checkType: 'basic' | 'premium' | 'comprehensive';
}

interface VehicleHistoryData {
  registration: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  engineSize: string;
  fuelType: string;
  checks: {
    stolen: {
      status: 'clear' | 'alert' | 'unknown';
      details?: string;
    };
    finance: {
      status: 'clear' | 'outstanding' | 'unknown';
      amount?: number;
      details?: string;
    };
    writeOff: {
      status: 'clear' | 'category_n' | 'category_s' | 'category_a' | 'category_b' | 'unknown';
      date?: string;
      details?: string;
    };
    mileage: {
      status: 'consistent' | 'discrepancy' | 'unknown';
      discrepancies?: Array<{
        date: string;
        recorded: number;
        expected: number;
        source: string;
      }>;
    };
    imports: {
      status: 'uk_vehicle' | 'imported' | 'unknown';
      importDate?: string;
      country?: string;
    };
    recalls: {
      status: 'none' | 'outstanding' | 'completed' | 'unknown';
      recalls?: Array<{
        id: string;
        description: string;
        date: string;
        status: 'outstanding' | 'completed';
      }>;
    };
    insurance: {
      totalClaims: number;
      majorClaims: number;
      lastClaimDate?: string;
      estimatedRepairCost?: number;
    };
    keeperHistory: {
      totalKeepers: number;
      lastTransferDate?: string;
      averageOwnershipPeriod: number;
    };
  };
  riskScore: number; // 0-100, higher is better
  recommendation: 'buy' | 'caution' | 'avoid';
  summary: string[];
  warnings: string[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { registration, vin, checkType }: VehicleCheckRequest = await request.json();

    if (!registration?.trim()) {
      return NextResponse.json(
        { error: 'Vehicle registration is required' },
        { status: 400 }
      );
    }

    // Get pricing based on check type
    const pricing = getCheckPricing(checkType);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pricing.amount,
      currency: 'gbp',
      metadata: {
        registration: registration.trim(),
        vin: vin || '',
        checkType,
        userId: session.user.id,
      },
    });

    // Save the check request to database
    const vehicleCheck = await db.vehicleCheck.create({
      data: {
        userId: session.user.id,
        registration: registration.trim(),
        vin: vin || null,
        paymentId: paymentIntent.id,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      checkId: vehicleCheck.id,
      clientSecret: paymentIntent.client_secret,
      pricing,
    });

  } catch (error) {
    console.error('Vehicle check error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate vehicle check' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const checkId = searchParams.get('checkId');

    if (!checkId) {
      return NextResponse.json(
        { error: 'Check ID is required' },
        { status: 400 }
      );
    }

    // Get the check from database
    const vehicleCheck = await db.vehicleCheck.findFirst({
      where: {
        id: checkId,
        userId: session.user.id,
      },
    });

    if (!vehicleCheck) {
      return NextResponse.json(
        { error: 'Vehicle check not found' },
        { status: 404 }
      );
    }

    // If payment is completed and we haven't generated results yet
    if (vehicleCheck.status === 'completed' && !vehicleCheck.results) {
      // Generate the vehicle history report
      const historyData = await generateVehicleHistoryReport(
        vehicleCheck.registration,
        vehicleCheck.vin
      );

      // Update the database with results
      await db.vehicleCheck.update({
        where: { id: checkId },
        data: { results: historyData as any },
      });

      return NextResponse.json({
        success: true,
        status: 'completed',
        data: historyData,
      });
    }

    return NextResponse.json({
      success: true,
      status: vehicleCheck.status,
      data: vehicleCheck.results as VehicleHistoryData | null,
    });

  } catch (error) {
    console.error('Get vehicle check error:', error);
    return NextResponse.json(
      { error: 'Failed to get vehicle check results' },
      { status: 500 }
    );
  }
}

function getCheckPricing(checkType: string) {
  switch (checkType) {
    case 'basic':
      return {
        amount: 299, // £2.99
        name: 'Basic Check',
        features: ['Stolen check', 'Outstanding finance', 'Write-off history']
      };
    case 'premium':
      return {
        amount: 699, // £6.99
        name: 'Premium Check',
        features: [
          'All Basic features',
          'Mileage verification',
          'Import history',
          'Outstanding recalls',
          'Insurance claims history'
        ]
      };
    case 'comprehensive':
      return {
        amount: 1299, // £12.99
        name: 'Comprehensive Check',
        features: [
          'All Premium features',
          'Detailed keeper history',
          'Full insurance claims analysis',
          'Risk assessment',
          'Buying recommendation'
        ]
      };
    default:
      return getCheckPricing('basic');
  }
}

async function generateVehicleHistoryReport(
  registration: string,
  vin?: string | null
): Promise<VehicleHistoryData> {
  // In production, this would call multiple data providers
  // For demo, we'll generate realistic mock data

  const mockData: VehicleHistoryData = {
    registration: registration.toUpperCase(),
    vin: vin || undefined,
    make: 'TOYOTA',
    model: 'COROLLA',
    year: 2019,
    colour: 'Silver',
    engineSize: '1198cc',
    fuelType: 'Petrol',
    checks: {
      stolen: {
        status: 'clear'
      },
      finance: {
        status: 'clear'
      },
      writeOff: {
        status: 'clear'
      },
      mileage: {
        status: 'consistent'
      },
      imports: {
        status: 'uk_vehicle'
      },
      recalls: {
        status: 'none'
      },
      insurance: {
        totalClaims: 1,
        majorClaims: 0,
        lastClaimDate: '2021-08-15',
        estimatedRepairCost: 450
      },
      keeperHistory: {
        totalKeepers: 2,
        lastTransferDate: '2022-03-10',
        averageOwnershipPeriod: 24
      }
    },
    riskScore: 85,
    recommendation: 'buy',
    summary: [
      'Vehicle has a clean history with no major issues',
      'Single minor insurance claim for cosmetic damage',
      'Consistent ownership pattern indicates good care',
      'No outstanding finance or theft markers'
    ],
    warnings: [
      'One minor insurance claim recorded in 2021'
    ]
  };

  // Add some randomization for demo purposes
  if (Math.random() > 0.7) {
    mockData.checks.finance.status = 'outstanding';
    mockData.checks.finance.amount = Math.floor(Math.random() * 10000) + 5000;
    mockData.riskScore = 45;
    mockData.recommendation = 'caution';
    mockData.warnings.push('Outstanding finance detected');
  }

  if (Math.random() > 0.8) {
    mockData.checks.mileage.status = 'discrepancy';
    mockData.checks.mileage.discrepancies = [
      {
        date: '2023-01-15',
        recorded: 45000,
        expected: 42000,
        source: 'MOT Test'
      }
    ];
    mockData.warnings.push('Mileage discrepancy detected');
  }

  return mockData;
}
