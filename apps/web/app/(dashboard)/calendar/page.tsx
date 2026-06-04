import { CalendarClient } from "@/components/dashboard/CalendarClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });

  if (!business) {
    redirect("/onboarding");
  }

  // Fetch all bookings for this business
  const bookings = await prisma.booking.findMany({
    where: { businessId: business.id },
    include: {
      service: {
        select: {
          name: true,
          price: true,
        }
      }
    },
    orderBy: { startTime: "asc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-light text-[#2C2C2C]">Calendar</h1>
        <p className="text-sm text-[#2C2C2C]/50 mt-1">
          Manage your schedule and view upcoming appointments.
        </p>
      </div>
      <CalendarClient bookings={bookings} />
    </div>
  );
}
