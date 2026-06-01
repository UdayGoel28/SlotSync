"use server";
import { prisma } from "@slotsync/database";
import { stripe } from "@/lib/stripe";
import { addMinutes } from "date-fns";
import { sendClientConfirmationEmail, sendBusinessNotificationEmail } from "@/lib/emails";

export async function createBookingIntent(data: {
  businessId: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startTime: Date;
}) {
  const business = await prisma.business.findUnique({
    where: { id: data.businessId },
    include: { services: true, user: true }
  });
  
  if (!business) throw new Error("Business not found");
  
  const service = business.services.find(s => s.id === data.serviceId);
  if (!service) throw new Error("Service not found");

  const endTime = addMinutes(data.startTime, service.durationMinutes);

  // Create booking as pending
  const booking = await prisma.booking.create({
    data: {
      businessId: data.businessId,
      serviceId: data.serviceId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      startTime: data.startTime,
      endTime: endTime,
      status: "pending"
    }
  });

  // If business doesn't have stripe connected, just mark as confirmed
  if (!business.stripeAccountId) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "confirmed" }
    });

    // Send emails since it's confirmed
    const emailData = {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      serviceName: service.name,
      businessName: business.name,
      businessEmail: business.user.email,
      startTime: data.startTime,
      bookingId: booking.id,
    };
    await Promise.all([
      sendClientConfirmationEmail(emailData),
      sendBusinessNotificationEmail(emailData)
    ]);

    return { success: true, bookingId: booking.id };
  }

  try {
    // Create Payment Intent with destination charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(service.price * 100), // Stripe expects cents
      currency: "usd",
      transfer_data: {
        destination: business.stripeAccountId,
      },
      metadata: {
        bookingId: booking.id
      }
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripePaymentIntentId: paymentIntent.id }
    });

    return { 
      clientSecret: paymentIntent.client_secret, 
      bookingId: booking.id 
    };
  } catch (stripeError) {
    console.error("Stripe payment intent failed:", stripeError);
    // If Stripe fails (e.g. missing API key in prod), fallback to confirming without payment
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "confirmed" }
    });

    const emailData = {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      serviceName: service.name,
      businessName: business.name,
      businessEmail: business.user.email,
      startTime: data.startTime,
      bookingId: booking.id,
    };
    await Promise.all([
      sendClientConfirmationEmail(emailData),
      sendBusinessNotificationEmail(emailData)
    ]);

    return { success: true, bookingId: booking.id, skippedPayment: true };
  }
}
