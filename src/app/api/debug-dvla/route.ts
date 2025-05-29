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

    console.log('🔍 DVLA API URL:', dvlaUrl);
    console.log('🚗 Testing registration:', registration);

    // Make the API call
    const response = await fetch(dvlaUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WorryFreeCarFinder/1.0'
      }
    });

    console.log('📡 DVLA API Response Status:', response.status);
    console.log('📡 DVLA API Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DVLA API Error Response:', errorText);
      return NextResponse.json({
        success: false,
        error: `DVLA API error: ${response.status} ${response.statusText}`,
        details: errorText,
        url: dvlaUrl
      });
    }

    const rawData = await response.text();
    console.log('📋 Raw DVLA Response:', rawData);

    let parsedData;
    try {
      parsedData = JSON.parse(rawData);
      console.log('✅ Parsed DVLA Data:', JSON.stringify(parsedData, null, 2));
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Failed to parse DVLA response',
        rawResponse: rawData,
        parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'DVLA API debug response',
      registration,
      rawResponse: rawData,
      parsedData,
      url: dvlaUrl,
      apiStatus: 'Connected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🚨 DVLA debug error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'DVLA debug failed',
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
    message: 'DVLA Debug API',
    usage: 'POST with {"registration": "AB12CDE"} to debug DVLA API response',
    apiKey: process.env.DVLA_VIN_API_KEY ? `${process.env.DVLA_VIN_API_KEY.substring(0, 8)}...` : 'Missing',
    apiUrl: process.env.DVLA_VIN_API_URL || 'Missing'
  });
}
