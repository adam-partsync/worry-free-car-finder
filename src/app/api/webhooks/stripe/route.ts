import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update the vehicle check status to completed
    await db.vehicleCheck.updateMany({
      where: {
        paymentId: paymentIntent.id,
        status: 'pending'
      },
      data: {
        status: 'completed'
      }
    });

    console.log(`Payment succeeded for vehicle check: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update the vehicle check status to failed
    await db.vehicleCheck.updateMany({
      where: {
        paymentId: paymentIntent.id,
        status: 'pending'
      },
      data: {
        status: 'failed'
      }
    });

    console.log(`Payment failed for vehicle check: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}
