import { prisma } from "@slotsync/database";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CustomerSettingsForm } from "@/components/customer/CustomerSettingsForm";
import Link from "next/link";

interface CustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerProfilePage({ params }: CustomerPageProps) {
  const { id } = await params;
  
  // Decode email from base64
  let email: string;
  try {
    email = decodeURIComponent(atob(id));
  } catch (e) {
    notFound();
  }

  // Fetch all bookings for this email
  const bookings = await prisma.booking.findMany({
    where: { clientEmail: email },
    include: {
      service: true,
      business: true,
    },
    orderBy: { startTime: "asc" },
  });

  if (bookings.length === 0) {
    notFound();
  }

  // Get the most recent name and phone
  const latestBooking = [...bookings].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  const customerName = latestBooking.clientName;
  const customerPhone = latestBooking.clientPhone;

  const now = new Date();
  
  // Segregate bookings
  const upcomingBookings = bookings.filter(b => b.startTime > now && b.status !== "cancelled");
  const pastBookings = bookings.filter(b => b.startTime <= now || b.status === "cancelled").sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  // Calculate stats
  const totalSpend = bookings
    .filter(b => b.status === "paid" || b.status === "confirmed")
    .reduce((sum, b) => sum + (b.service?.price || 0), 0);
  
  const completedCount = pastBookings.filter(b => b.status === "paid" || b.status === "confirmed").length;

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EDE6] via-[#F5F0EA] to-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#F2A99A]/40 to-[#F7C4BC]/0 blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#E8EDE6]/80 to-white/0 blur-3xl -z-10" />

      <div className="container mx-auto max-w-3xl py-12 px-4 relative z-0 pb-32">
        
        {/* Header Profile */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4846A]/20 to-[#D4846A]/5 flex items-center justify-center mb-4 shadow-xl shadow-[#D4846A]/10 border border-white">
            <span className="text-3xl font-serif text-[#D4846A]">{getInitials(customerName)}</span>
          </div>
          <h1 className="text-3xl font-display font-light text-[#2C2C2C]">{customerName}</h1>
          <p className="text-[#2C2C2C]/50 mt-1">{email}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/60 text-center">
            <p className="text-xs font-semibold text-[#2C2C2C]/40 uppercase tracking-wider mb-1">Total Spent</p>
            <p className="text-3xl font-display font-light text-emerald-700">${totalSpend.toFixed(2)}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/60 text-center">
            <p className="text-xs font-semibold text-[#2C2C2C]/40 uppercase tracking-wider mb-1">Visits</p>
            <p className="text-3xl font-display font-light text-[#2C2C2C]">{completedCount}</p>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-6 md:p-8">
              <h2 className="text-xl font-serif font-light text-[#2C2C2C] mb-6 flex items-center gap-2">
                Upcoming Appointments
                <span className="bg-[#D4846A] text-white text-xs font-bold px-2 py-0.5 rounded-full">{upcomingBookings.length}</span>
              </h2>
              <div className="space-y-4">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="bg-white/60 border border-white/80 rounded-2xl p-5 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-[#2C2C2C]">{booking.service?.name}</h3>
                        <p className="text-sm text-[#2C2C2C]/60 mt-0.5 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">🏢</span>
                          {booking.business?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#D4846A]">${booking.service?.price}</p>
                        <p className="text-[10px] text-[#2C2C2C]/40 uppercase font-semibold mt-1 tracking-wider bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full inline-block">
                          {booking.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#2C2C2C]/70 bg-white/50 p-3 rounded-xl mb-4">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        {format(new Date(booking.startTime), "EEEE, MMM d, yyyy")}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-300" />
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        {format(new Date(booking.startTime), "h:mm a")}
                      </div>
                    </div>
                    <Link 
                      href={`/manage-booking/${booking.id}`}
                      className="inline-block text-sm font-medium text-[#D4846A] hover:text-[#c67a62] transition-colors"
                    >
                      Manage booking &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-6 md:p-8">
              <h2 className="text-xl font-serif font-light text-[#2C2C2C] mb-6">Past Appointments</h2>
              <div className="space-y-3">
                {pastBookings.map(booking => (
                  <div key={booking.id} className="flex justify-between items-center p-4 rounded-2xl bg-white/50 border border-white/60">
                    <div>
                      <h3 className="font-medium text-[#2C2C2C] text-sm">{booking.service?.name}</h3>
                      <p className="text-xs text-[#2C2C2C]/50 mt-1">{booking.business?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#2C2C2C]/70">{format(new Date(booking.startTime), "MMM d, yyyy")}</p>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5 inline-block
                        ${booking.status === 'cancelled' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}
                      `}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Section */}
          <CustomerSettingsForm 
            email={email} 
            initialName={customerName} 
            initialPhone={customerPhone} 
          />

        </div>
      </div>
    </div>
  );
}
