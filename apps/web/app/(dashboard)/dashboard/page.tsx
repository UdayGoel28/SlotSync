import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { BookingLinkHeader } from "@/components/dashboard/setup/BookingLinkHeader";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        include: {
          service: { select: { name: true, price: true } },
          staff: { select: { name: true } },
        },
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!business) redirect("/onboarding");

  // --- Compute stats from the bookings array ---
  const now = new Date();

  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const todayCount = business.bookings.filter(
    (b) => b.startTime >= todayStart && b.startTime <= todayEnd
  ).length;

  const weekCount = business.bookings.filter(
    (b) => b.startTime >= weekStart && b.startTime <= weekEnd
  ).length;

  const monthRevenue = business.bookings
    .filter(
      (b) =>
        b.status === "confirmed" &&
        b.startTime >= monthStart &&
        b.startTime <= monthEnd
    )
    .reduce((sum, b) => sum + (b.service?.price ?? 0), 0);

  const uniqueClients = new Set(business.bookings.map((b) => b.clientEmail)).size;

  // --- Upcoming bookings: next 5 from now, not cancelled ---
  const upcoming = business.bookings.filter(
    (b) => b.startTime >= now && b.status !== "cancelled"
  ).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="font-semibold text-foreground">{business.name}</span>!
          Here&apos;s an overview of your business.
        </p>
      </div>

      {/* Quick-share booking link */}
      <BookingLinkHeader slug={business.slug} />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Today's Bookings" value={String(todayCount)} icon="calendar" />
        <StatsCard title="This Week" value={String(weekCount)} icon="trending-up" />
        <StatsCard
          title="Revenue (Month)"
          value={`$${monthRevenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
          icon="dollar-sign"
        />
        <StatsCard title="Total Clients" value={String(uniqueClients)} icon="users" />
      </div>

      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Upcoming Bookings</h2>
        {upcoming.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p className="font-medium text-slate-700">No upcoming bookings yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Share your booking link with clients to get your first appointment!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <BookingCard
                key={booking.id}
                clientName={booking.clientName}
                serviceName={booking.service?.name ?? "Service"}
                time={format(new Date(booking.startTime), "EEE, MMM d · h:mm a")}
                status={booking.status}
                staffName={booking.staff?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
