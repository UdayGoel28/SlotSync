import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import { format } from "date-fns";

export default async function ClientsPage() {
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

  const bookings = await prisma.booking.findMany({
    where: { businessId: business.id },
    include: { service: true },
    orderBy: { createdAt: "desc" }
  });

  const clientMap = new Map();
  for (const booking of bookings) {
    if (!clientMap.has(booking.clientEmail)) {
      clientMap.set(booking.clientEmail, {
        name: booking.clientName,
        email: booking.clientEmail,
        phone: booking.clientPhone,
        totalSpend: 0,
        bookingCount: 0,
        lastBookingDate: booking.startTime,
      });
    }
    const client = clientMap.get(booking.clientEmail);
    client.bookingCount += 1;
    if (booking.status === "paid" || booking.status === "confirmed") {
      client.totalSpend += booking.service?.price || 0;
    }
    if (booking.startTime > client.lastBookingDate) {
      client.lastBookingDate = booking.startTime;
    }
  }

  const clients = Array.from(clientMap.values()).sort((a, b) => b.lastBookingDate.getTime() - a.lastBookingDate.getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client database and booking history.
          </p>
        </div>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description="Clients will appear here once they book an appointment."
          icon="users"
        />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-500">Client Info</th>
                <th className="px-4 py-3 font-medium text-slate-500">Phone</th>
                <th className="px-4 py-3 font-medium text-slate-500">Bookings</th>
                <th className="px-4 py-3 font-medium text-slate-500">Total Spend</th>
                <th className="px-4 py-3 font-medium text-slate-500">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.map((client) => (
                <tr key={client.email} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{client.name}</div>
                    <div className="text-slate-500 text-xs">{client.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{client.phone}</td>
                  <td className="px-4 py-3 font-medium">{client.bookingCount}</td>
                  <td className="px-4 py-3 font-medium text-green-700">${client.totalSpend.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{format(new Date(client.lastBookingDate), "MMM d, yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
