import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const { amount = 2999 } = await request.json(); // Default £29.99

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    });

    console.log('Testing Stripe payment intent creation for amount:', amount);

    // Create a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in pence
      currency: 'gbp',
      payment_method_types: ['card'],
      metadata: {
        service: 'worry-free-car-finder-test',
        test: 'true'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Stripe payment intent created successfully',
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret
      },
      stripeStatus: 'Connected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Stripe test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stripeStatus: 'Error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing Stripe configuration
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Stripe API Test Endpoint',
    usage: 'POST with {"amount": 2999} to test payment intent creation (amount in pence)',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing',
    stripePublicKey: process.env.STRIPE_PUBLISHABLE_KEY ? 'Configured' : 'Missing',
    keyType: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'Test Key' : 'Live Key'
  });
}
