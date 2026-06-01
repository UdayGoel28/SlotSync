import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { EmptyState } from "@/components/shared/EmptyState";
import { createStripeConnectAccount, disconnectStripeAccount } from "@/app/actions/stripe";
import { startOfMonth, endOfMonth, format } from "date-fns";
import Stripe from "stripe";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: { connected?: string; account_id?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        where: { stripePaymentIntentId: { not: null } },
        include: { service: true },
        orderBy: { createdAt: "desc" },
      },
    }
  });

  if (!business) {
    redirect("/onboarding");
  }

  let isConnected = false;
  let requireAdditionalDetails = false;
  let stripeEmail = "";

  // Verify Stripe account status
  if (searchParams.connected === "true" && searchParams.account_id) {
    const account = await stripe.accounts.retrieve(searchParams.account_id);
    if (account.details_submitted) {
      isConnected = true;
      stripeEmail = account.email || "";
      if (business.stripeAccountId !== account.id) {
        await prisma.business.update({
          where: { id: business.id },
          data: { stripeAccountId: account.id },
        });
      }
    } else {
      requireAdditionalDetails = true;
    }
  } else if (business.stripeAccountId) {
    const account = await stripe.accounts.retrieve(business.stripeAccountId);
    if (account.details_submitted) {
      isConnected = true;
      stripeEmail = account.email || "";
    } else {
      requireAdditionalDetails = true;
    }
  }

  // Calculate revenue
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const totalRevenue = business.bookings
    .filter(b => b.status === "paid" || b.status === "confirmed")
    .reduce((sum, b) => sum + (b.service?.price ?? 0), 0);

  const monthRevenue = business.bookings
    .filter(b => (b.status === "paid" || b.status === "confirmed") && b.createdAt >= monthStart && b.createdAt <= monthEnd)
    .reduce((sum, b) => sum + (b.service?.price ?? 0), 0);

  const pendingRevenue = business.bookings
    .filter(b => b.status === "pending")
    .reduce((sum, b) => sum + (b.service?.price ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Track payments and manage your Stripe account.
          </p>
        </div>
        {isConnected && (
          <form action={disconnectStripeAccount}>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              Disconnect Stripe
            </button>
          </form>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-medium text-muted-foreground">This Month</p>
          <p className="text-3xl font-bold mt-1">${monthRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-medium text-muted-foreground">Pending</p>
          <p className="text-3xl font-bold mt-1">${pendingRevenue.toFixed(2)}</p>
        </div>
      </div>

      {!isConnected ? (
        <div className="rounded-xl border bg-white p-8 text-center max-w-2xl mx-auto mt-8 shadow-sm">
          <div className="w-12 h-12 bg-[#635BFF]/10 text-[#635BFF] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Connect your Stripe account</h2>
          <p className="text-muted-foreground mb-6">
            {requireAdditionalDetails
              ? "You started connecting your Stripe account but didn't finish. Please complete the setup to accept payments."
              : "Set up Stripe to accept secure card payments directly from your booking page."}
          </p>
          <form action={createStripeConnectAccount}>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#635BFF] hover:bg-[#4B45CC] text-white rounded-lg font-medium transition-colors"
            >
              {requireAdditionalDetails ? "Complete Stripe Setup" : "Connect Stripe"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6 mt-8">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Stripe Connected Successfully</p>
              {stripeEmail && <p className="text-xs text-green-700">Account: {stripeEmail}</p>}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            {business.bookings.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="When clients pay for bookings, they will appear here."
                icon="receipt"
              />
            ) : (
              <div className="rounded-xl border bg-white overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium text-slate-500">Client</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Service</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Amount</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Date</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {business.bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium">{booking.clientName}</td>
                        <td className="px-4 py-3 text-slate-600">{booking.service?.name}</td>
                        <td className="px-4 py-3 font-medium">${booking.service?.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-slate-600">{format(new Date(booking.createdAt), "MMM d, yyyy")}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
