import { inngest } from "../lib/inngest";
import { prisma } from "../lib/db";
import { sendEmail } from "../lib/resend";

export const reviewRequest = inngest.createFunction(
  { id: "review-request" },
  { cron: "0 10 * * *" }, // Run daily at 10am
  async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        status: "completed",
        reviewRequestSent: false,
        endTime: { gte: yesterday, lt: today },
      },
      include: { service: true, business: true },
    });

    for (const booking of bookings) {
      if (!booking.business.reviewsEnabled || !booking.business.googlePlaceId) {
        continue;
      }

      const reviewUrl = `https://search.google.com/local/writereview?placeid=${booking.business.googlePlaceId}`;

      await sendEmail({
        to: booking.clientEmail,
        subject: `How was your ${booking.service.name}?`,
        html: `<p>Hi ${booking.clientName}, thank you for visiting ${booking.business.name}! We'd love to hear your feedback.</p><p><a href="${reviewUrl}">Leave a review</a></p>`,
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { reviewRequestSent: true },
      });
    }

    return { sent: bookings.length };
  }
);
