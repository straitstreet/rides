import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { payments, bookings } from '@/lib/db/schema';
import crypto from 'crypto';

// POST /api/payments/paystack/webhook - Paystack webhook handler
export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();

    if (!signature) {
      console.error('No signature provided');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    // Verify signature
    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event.event, event.data?.reference);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data);
        break;

      case 'charge.failed':
        await handleFailedPayment(event.data);
        break;

      default:
        console.log('Unhandled event type:', event.event);
    }

    return NextResponse.json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleSuccessfulPayment(data: { reference: string; amount: number }) {
  try {
    const reference = data.reference;
    const amount = data.amount / 100; // Paystack amounts are in kobo

    // Find the payment record
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.paystackReference, reference))
      .limit(1);

    if (!payment) {
      console.error('Payment not found for reference:', reference);
      return;
    }

    // Update payment status
    await db
      .update(payments)
      .set({
        status: 'success',
        paidAt: new Date(),
      })
      .where(eq(payments.id, payment.id));

    // Update booking status to confirmed
    await db
      .update(bookings)
      .set({
        status: 'confirmed',
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, payment.bookingId));

    console.log('Payment successful for booking:', payment.bookingId);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(data: { reference: string }) {
  try {
    const reference = data.reference;

    // Find the payment record
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.paystackReference, reference))
      .limit(1);

    if (!payment) {
      console.error('Payment not found for reference:', reference);
      return;
    }

    // Update payment status
    await db
      .update(payments)
      .set({
        status: 'failed',
      })
      .where(eq(payments.id, payment.id));

    console.log('Payment failed for booking:', payment.bookingId);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}