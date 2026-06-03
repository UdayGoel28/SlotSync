import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { redirect } from "next/navigation";
import { ClientsTable, ClientData } from "@/components/dashboard/clients/ClientsTable";

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
    orderBy: { startTime: "desc" }
  });

  const clientMap = new Map<string, ClientData>();

  for (const booking of bookings) {
    if (!clientMap.has(booking.clientEmail)) {
      clientMap.set(booking.clientEmail, {
        name: booking.clientName,
        email: booking.clientEmail,
        phone: booking.clientPhone,
        totalSpend: 0,
        bookingCount: 0,
        lastBookingDate: booking.startTime.toISOString(),
        firstBookingDate: booking.startTime.toISOString(),
        bookings: [],
      });
    }
    
    const client = clientMap.get(booking.clientEmail)!;
    client.bookingCount += 1;
    
    if (booking.status === "paid" || booking.status === "confirmed") {
      client.totalSpend += booking.service?.price || 0;
    }
    
    if (new Date(booking.startTime) > new Date(client.lastBookingDate)) {
      client.lastBookingDate = booking.startTime.toISOString();
    }
    
    if (new Date(booking.startTime) < new Date(client.firstBookingDate)) {
      client.firstBookingDate = booking.startTime.toISOString();
    }
    
    client.bookings.push({
      id: booking.id,
      serviceName: booking.service?.name || "Unknown Service",
      startTime: booking.startTime.toISOString(),
      status: booking.status,
      price: booking.service?.price || 0,
    });
  }

  const clients = Array.from(clientMap.values());

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

      <ClientsTable clients={clients} bookingSlug={business.slug} />
    </div>
  );
}
