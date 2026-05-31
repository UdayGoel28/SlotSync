import { inngest } from "../lib/inngest";
import { prisma } from "../lib/db";
import { sendSMS } from "../lib/twilio";

export const reminder2hr = inngest.createFunction(
  { id: "reminder-2hr" },
  { cron: "*/15 * * * *" }, // Run every 15 minutes
  async () => {
    const now = new Date();
    const in2hrs = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const in2hrs15 = new Date(now.getTime() + 2.25 * 60 * 60 * 1000);

    const bookings = await prisma.booking.findMany({
      where: {
        status: "confirmed",
        reminderSent2hr: false,
        startTime: { gte: in2hrs, lt: in2hrs15 },
      },
      include: { service: true, business: true },
    });

    for (const booking of bookings) {
      if (booking.clientPhone) {
        await sendSMS(
          booking.clientPhone,
          `Your ${booking.service.name} at ${booking.business.name} is in 2 hours. See you soon!`
        );
      }

      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminderSent2hr: true },
      });
    }

    return { sent: bookings.length };
  }
);
