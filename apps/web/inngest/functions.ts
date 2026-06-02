import { inngest } from "@/lib/inngest";
import { prisma } from "@slotsync/database";
import { sendBookingReminderEmail, sendReviewRequestEmail, sendDailySummaryEmail } from "@/lib/emails";
import { sendTwoHourReminderSms, sendReviewRequestSms } from "@/lib/sms";
import { startOfDay, endOfDay, addDays } from "date-fns";
import { posthogServer } from "@/lib/posthog-server";

/* ═══════════════════════════════════════════════════════
   1. 24-HOUR EMAIL REMINDER
   Triggered by: booking/created
   Runs:         24h before startTime
═══════════════════════════════════════════════════════ */
export const reminder24hr = inngest.createFunction(
  { id: "booking-reminder-24hr", name: "Booking Reminder (24hr Email)" },
  { event: "booking/created" },
  async ({ event, step }) => {
    const { data } = event;

    // Calculate delay until 24h before appointment
    const startTime = new Date(data.startTime);
    const sendAt = new Date(startTime.getTime() - 24 * 60 * 60 * 1000);
    const delayMs = sendAt.getTime() - Date.now();

    // If appointment is less than 24h away, skip
    if (delayMs <= 0) {
      return { skipped: true, reason: "Appointment is less than 24h away" };
    }

    // Sleep until 24h before
    await step.sleep("wait-24hr-before", delayMs);

    // Check the booking still exists and isn't cancelled
    const booking = await step.run("check-booking", async () => {
      return prisma.booking.findUnique({
        where: { id: data.bookingId },
      });
    });

    if (!booking || booking.status === "cancelled" || booking.reminderSent24hr) {
      return { skipped: true, reason: "Booking cancelled or reminder already sent" };
    }

    // Send reminder email
    await step.run("send-reminder-email", async () => {
      await sendBookingReminderEmail({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        serviceName: data.serviceName,
        serviceDuration: data.serviceDuration,
        servicePrice: data.servicePrice,
        businessName: data.businessName,
        businessEmail: data.businessEmail,
        businessLogoUrl: data.businessLogoUrl,
        businessSlug: data.businessSlug,
        startTime: new Date(data.startTime),
        bookingId: data.bookingId,
      });
    });

    // Mark reminder as sent
    await step.run("mark-reminder-sent", async () => {
      await prisma.booking.update({
        where: { id: data.bookingId },
        data: { reminderSent24hr: true },
      });
    });

    return { success: true, sentAt: new Date().toISOString() };
  }
);

/* ═══════════════════════════════════════════════════════
   2. 2-HOUR SMS REMINDER
   Triggered by: booking/created
   Runs:         2h before startTime
═══════════════════════════════════════════════════════ */
export const reminder2hr = inngest.createFunction(
  { id: "booking-reminder-2hr", name: "Booking Reminder (2hr SMS)" },
  { event: "booking/created" },
  async ({ event, step }) => {
    const { data } = event;

    const startTime = new Date(data.startTime);
    const sendAt = new Date(startTime.getTime() - 2 * 60 * 60 * 1000);
    const delayMs = sendAt.getTime() - Date.now();

    if (delayMs <= 0) {
      return { skipped: true, reason: "Appointment is less than 2h away" };
    }

    await step.sleep("wait-2hr-before", delayMs);

    const booking = await step.run("check-booking", async () => {
      return prisma.booking.findUnique({
        where: { id: data.bookingId },
      });
    });

    if (!booking || booking.status === "cancelled" || booking.reminderSent2hr) {
      return { skipped: true, reason: "Booking cancelled or reminder already sent" };
    }

    await step.run("send-2hr-sms", async () => {
      await sendTwoHourReminderSms({
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        serviceName: data.serviceName,
        businessName: data.businessName,
        googlePlaceId: data.googlePlaceId,
        startTime: new Date(data.startTime),
        bookingId: data.bookingId,
      });
    });

    await step.run("mark-2hr-sent", async () => {
      await prisma.booking.update({
        where: { id: data.bookingId },
        data: { reminderSent2hr: true },
      });
    });

    return { success: true, sentAt: new Date().toISOString() };
  }
);

/* ═══════════════════════════════════════════════════════
   3. GOOGLE REVIEW REQUEST
   Triggered by: booking/completed
   Runs:         1h after endTime
═══════════════════════════════════════════════════════ */
export const reviewRequest = inngest.createFunction(
  { id: "booking-review-request", name: "Booking Review Request" },
  { event: "booking/completed" },
  async ({ event, step }) => {
    const { data } = event;

    // Only run if business has a Google Place ID
    if (!data.googlePlaceId) {
      return { skipped: true, reason: "No googlePlaceId configured for this business" };
    }

    const endTime = new Date(data.endTime);
    const sendAt = new Date(endTime.getTime() + 60 * 60 * 1000); // 1hr after end
    const delayMs = sendAt.getTime() - Date.now();

    if (delayMs > 0) {
      await step.sleep("wait-1hr-after-end", delayMs);
    }

    // Check booking hasn't already had a review request
    const booking = await step.run("check-review-sent", async () => {
      return prisma.booking.findUnique({
        where: { id: data.bookingId },
      });
    });

    if (!booking || booking.reviewRequestSent) {
      return { skipped: true, reason: "Review request already sent" };
    }

    // Send SMS review request
    await step.run("send-review-sms", async () => {
      await sendReviewRequestSms({
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        serviceName: "your appointment",
        businessName: data.businessName,
        googlePlaceId: data.googlePlaceId,
        startTime: new Date(data.endTime),
        bookingId: data.bookingId,
      });
    });

    // Send email review request
    await step.run("send-review-email", async () => {
      await sendReviewRequestEmail({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        businessName: data.businessName,
        businessLogoUrl: data.businessLogoUrl,
        googlePlaceId: data.googlePlaceId,
      });
    });

    // Mark as sent
    await step.run("mark-review-sent", async () => {
      await prisma.booking.update({
        where: { id: data.bookingId },
        data: { reviewRequestSent: true },
      });
    });

    await step.run("track-analytics", async () => {
      posthogServer.capture({
        distinctId: data.clientEmail,
        event: "review_request_sent",
        properties: {
          businessId: booking.businessId,
          googlePlaceId: data.googlePlaceId,
        },
      });
      await posthogServer.flush();
    });

    return { success: true, sentAt: new Date().toISOString() };
  }
);

/* ═══════════════════════════════════════════════════════
   4. DAILY BUSINESS SUMMARY
   Cron: every day at 8:00 AM UTC
   (adjust to business timezone in the email content)
═══════════════════════════════════════════════════════ */
export const dailySummary = inngest.createFunction(
  { id: "business-daily-summary", name: "Business Daily Summary Email" },
  { cron: "0 8 * * *" }, // 8:00 AM UTC daily
  async ({ step }) => {
    // Get all active businesses
    const businesses = await step.run("fetch-businesses", async () => {
      return prisma.business.findMany({
        include: { user: true },
      });
    });

    const results = await Promise.all(
      businesses.map(async (business) => {
        return step.run(`summary-${business.id}`, async () => {
          const todayStart = startOfDay(new Date());
          const todayEnd = endOfDay(new Date());
          const tomorrowStart = startOfDay(addDays(new Date(), 1));
          const tomorrowEnd = endOfDay(addDays(new Date(), 1));

          // Fetch today's bookings with service details
          const todayBookings = await prisma.booking.findMany({
            where: {
              businessId: business.id,
              startTime: { gte: todayStart, lte: todayEnd },
              status: { not: "cancelled" },
            },
            include: { service: true },
            orderBy: { startTime: "asc" },
          });

          // Fetch tomorrow's bookings
          const tomorrowBookings = await prisma.booking.findMany({
            where: {
              businessId: business.id,
              startTime: { gte: tomorrowStart, lte: tomorrowEnd },
              status: { not: "cancelled" },
            },
            include: { service: true },
            orderBy: { startTime: "asc" },
          });

          const todayRevenue = todayBookings
            .filter((b) => b.status === "paid")
            .reduce((sum, b) => sum + b.service.price, 0);

          await sendDailySummaryEmail({
            businessName: business.name,
            businessEmail: business.user.email,
            businessLogoUrl: business.logoUrl,
            todayBookings: todayBookings.map((b) => ({
              clientName: b.clientName,
              serviceName: b.service.name,
              startTime: b.startTime,
              price: b.service.price,
            })),
            tomorrowBookings: tomorrowBookings.map((b) => ({
              clientName: b.clientName,
              serviceName: b.service.name,
              startTime: b.startTime,
            })),
            todayRevenue,
          });

          return { businessId: business.id, todayCount: todayBookings.length };
        });
      })
    );

    return { processed: results.length, results };
  }
);
