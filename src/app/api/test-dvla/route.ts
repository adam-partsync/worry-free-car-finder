import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { registration } = await request.json();

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration number required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DVLA_VIN_API_KEY;
    const apiUrl = process.env.DVLA_VIN_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { success: false, error: 'DVLA API not configured' },
        { status: 500 }
      );
    }

    // Build the API URL
    const dvlaUrl = `${apiUrl}${apiKey}&key_vrm=${registration}`;

    console.log('Testing DVLA API for registration:', registration);

    // Make the API call
    const response = await fetch(dvlaUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WorryFreeCarFinder/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`DVLA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'DVLA API test successful',
      registration,
      data: {
        // Only return safe, non-sensitive data for testing
        make: data.Make || 'N/A',
        model: data.Model || 'N/A',
        year: data.YearOfManufacture || 'N/A',
        fuelType: data.FuelType || 'N/A',
        engineSize: data.EngineCapacity || 'N/A',
        color: data.Colour || 'N/A',
        motStatus: data.MotStatus || 'N/A',
        motExpiry: data.MotExpiryDate || 'N/A'
      },
      apiStatus: 'Connected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('DVLA API test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'DVLA API test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiStatus: 'Error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing without registration
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'DVLA API Test Endpoint',
    usage: 'POST with {"registration": "AB12CDE"} to test vehicle lookup',
    apiKey: process.env.DVLA_VIN_API_KEY ? 'Configured' : 'Missing',
    apiUrl: process.env.DVLA_VIN_API_URL ? 'Configured' : 'Missing'
  });
}
