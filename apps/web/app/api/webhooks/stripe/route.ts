import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@slotsync/database";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret not set" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Find the booking associated with this payment intent
        const booking = await prisma.booking.findFirst({
          where: { stripePaymentIntentId: paymentIntent.id },
        });

        if (booking) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: "paid" },
          });
          console.log(`✅ Booking ${booking.id} marked as paid`);
        } else {
          console.log(`⚠️ Payment succeeded for intent ${paymentIntent.id} but no booking found.`);
        }
        break;
      }
      // You can handle other events like 'account.updated' here if needed.
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
