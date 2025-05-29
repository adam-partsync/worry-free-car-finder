import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test all API keys are loaded (without exposing the actual values)
    const apiKeys = {
      openai: process.env.OPENAI_API_KEY ? 'Configured' : 'Missing',
      stripe_secret: process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing',
      stripe_public: process.env.STRIPE_PUBLISHABLE_KEY ? 'Configured' : 'Missing',
      google_client_id: process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Missing',
      google_client_secret: process.env.GOOGLE_CLIENT_SECRET ? 'Configured' : 'Missing',
      sendbird_app_id: process.env.SENDBIRD_APP_ID ? 'Configured' : 'Missing',
      sendbird_token: process.env.SENDBIRD_MASTER_API_TOKEN ? 'Configured' : 'Missing',
      dvla_api_key: process.env.DVLA_VIN_API_KEY ? 'Configured' : 'Missing',
      dvla_api_url: process.env.DVLA_VIN_API_URL ? 'Configured' : 'Missing',
      nextauth_secret: process.env.NEXTAUTH_SECRET ? 'Configured' : 'Missing',
      nextauth_url: process.env.NEXTAUTH_URL ? 'Configured' : 'Missing'
    };

    // Test basic API connectivity (non-sensitive)
    const connectivity = {
      stripe_public_key_format: process.env.STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') ? 'Valid Test Key' : 'Invalid Format',
      stripe_secret_key_format: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'Valid Test Key' : 'Invalid Format',
      google_client_id_format: process.env.GOOGLE_CLIENT_ID?.includes('.apps.googleusercontent.com') ? 'Valid Format' : 'Invalid Format',
      openai_key_format: process.env.OPENAI_API_KEY?.startsWith('sk-') ? 'Valid Format' : 'Invalid Format'
    };

    return NextResponse.json({
      success: true,
      message: 'API Keys Configuration Test',
      apiKeys,
      connectivity,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Keys test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test API keys configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
