"use server";
import { prisma } from "@slotsync/database";
import { stripe } from "@/lib/stripe";
import { addMinutes } from "date-fns";
import { sendClientConfirmationEmail, sendBusinessNotificationEmail } from "@/lib/emails";
import { sendBookingConfirmationSms } from "@/lib/sms";
import { inngest } from "@/lib/inngest";

function buildEmailData(data: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startTime: Date;
  bookingId: string;
}, service: { name: string; durationMinutes: number; price: number }, business: { name: string; logoUrl: string | null; slug: string; user: { email: string } }, paymentStatus: "paid" | "pending" | "free") {
  return {
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone,
    serviceName: service.name,
    serviceDuration: service.durationMinutes,
    servicePrice: service.price,
    businessName: business.name,
    businessEmail: business.user.email,
    businessLogoUrl: business.logoUrl,
    businessSlug: business.slug,
    startTime: data.startTime,
    bookingId: data.bookingId,
    paymentStatus,
  };
}

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
    const emailData = buildEmailData(
      { ...data, bookingId: booking.id },
      service,
      business,
      service.price > 0 ? "pending" : "free"
    );
    await Promise.all([
      sendClientConfirmationEmail(emailData),
      sendBusinessNotificationEmail(emailData),
      sendBookingConfirmationSms({
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        serviceName: service.name,
        businessName: business.name,
        googlePlaceId: business.googlePlaceId,
        startTime: data.startTime,
        bookingId: booking.id,
      }),
    ]);

    // Dispatch Inngest event to schedule reminders
    await inngest.send({
      name: "booking/created",
      data: {
        bookingId: booking.id,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        serviceName: service.name,
        serviceDuration: service.durationMinutes,
        servicePrice: service.price,
        businessName: business.name,
        businessEmail: business.user.email,
        businessLogoUrl: business.logoUrl,
        businessSlug: business.slug,
        googlePlaceId: business.googlePlaceId,
        startTime: data.startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });

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

    const emailData = buildEmailData(
      { ...data, bookingId: booking.id },
      service,
      business,
      "free"
    );
    await Promise.all([
      sendClientConfirmationEmail(emailData),
      sendBusinessNotificationEmail(emailData),
      sendBookingConfirmationSms({
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        serviceName: service.name,
        businessName: business.name,
        googlePlaceId: business.googlePlaceId,
        startTime: data.startTime,
        bookingId: booking.id,
      }),
    ]);

    // Dispatch Inngest event to schedule reminders
    await inngest.send({
      name: "booking/created",
      data: {
        bookingId: booking.id,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        serviceName: service.name,
        serviceDuration: service.durationMinutes,
        servicePrice: service.price,
        businessName: business.name,
        businessEmail: business.user.email,
        businessLogoUrl: business.logoUrl,
        businessSlug: business.slug,
        googlePlaceId: business.googlePlaceId,
        startTime: data.startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });

    return { success: true, bookingId: booking.id, skippedPayment: true };
  }
}
