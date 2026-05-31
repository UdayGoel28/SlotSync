import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookingCard } from "@/components/dashboard/BookingCard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Today's Bookings" value="0" icon="calendar" />
        <StatsCard title="This Week" value="0" icon="trending-up" />
        <StatsCard title="Revenue" value="$0" icon="dollar-sign" />
        <StatsCard title="Clients" value="0" icon="users" />
      </div>

      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Upcoming Bookings</h2>
        <div className="space-y-3">
          <BookingCard
            clientName="No bookings yet"
            serviceName="Create your first service to get started"
            time=""
            status="confirmed"
          />
        </div>
      </div>
    </div>
  );
}
