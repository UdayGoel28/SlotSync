import { inngest } from "../lib/inngest";
import { prisma } from "../lib/db";
import { sendEmail } from "../lib/resend";

export const dailySummary = inngest.createFunction(
  { id: "daily-summary" },
  { cron: "0 8 * * *" }, // Run daily at 8am
  async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const businesses = await prisma.business.findMany({
      include: { user: true },
    });

    for (const business of businesses) {
      const todayBookings = await prisma.booking.findMany({
        where: {
          businessId: business.id,
          startTime: { gte: today, lt: tomorrow },
          status: "confirmed",
        },
        include: { service: true, staff: true },
        orderBy: { startTime: "asc" },
      });

      if (todayBookings.length === 0) continue;

      const bookingsList = todayBookings
        .map(
          (b) =>
            `• ${b.startTime.toLocaleTimeString()} - ${b.clientName} (${b.service.name})`
        )
        .join("<br>");

      await sendEmail({
        to: business.user.email,
        subject: `📅 Today's Schedule: ${todayBookings.length} booking(s)`,
        html: `<h2>Good morning!</h2><p>You have ${todayBookings.length} booking(s) today:</p><p>${bookingsList}</p>`,
      });
    }

    return { businessesNotified: businesses.length };
  }
);
