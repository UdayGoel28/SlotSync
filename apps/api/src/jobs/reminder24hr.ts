import { inngest } from "../lib/inngest";
import { prisma } from "../lib/db";
import { sendEmail } from "../lib/resend";
import { sendSMS } from "../lib/twilio";

export const reminder24hr = inngest.createFunction(
  { id: "reminder-24hr" },
  { cron: "0 * * * *" }, // Run every hour
  async () => {
    const now = new Date();
    const in24hrs = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25hrs = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const bookings = await prisma.booking.findMany({
      where: {
        status: "confirmed",
        reminderSent24hr: false,
        startTime: { gte: in24hrs, lt: in25hrs },
      },
      include: { service: true, business: true },
    });

    for (const booking of bookings) {
      await sendEmail({
        to: booking.clientEmail,
        subject: `Reminder: ${booking.service.name} tomorrow`,
        html: `<p>Hi ${booking.clientName}, this is a reminder that your ${booking.service.name} appointment at ${booking.business.name} is tomorrow at ${booking.startTime.toLocaleTimeString()}.</p>`,
      });

      if (booking.clientPhone) {
        await sendSMS(
          booking.clientPhone,
          `Reminder: Your ${booking.service.name} at ${booking.business.name} is tomorrow.`
        );
      }

      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminderSent24hr: true },
      });
    }

    return { sent: bookings.length };
  }
);
