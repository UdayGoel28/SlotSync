import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { EmptyState } from "@/components/shared/EmptyState";
import { createStripeConnectAccount } from "@/app/actions/stripe";

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
  });

  if (!business) {
    redirect("/onboarding");
  }

  let isConnected = false;
  let requireAdditionalDetails = false;

  // If returning from Stripe onboarding, or if they already have an account, verify status
  if (searchParams.connected === "true" && searchParams.account_id) {
    // Verify the account from Stripe
    const account = await stripe.accounts.retrieve(searchParams.account_id);
    
    if (account.details_submitted) {
      // It's fully connected and details are submitted
      isConnected = true;
      
      // Ensure the DB has the account ID saved
      if (business.stripeAccountId !== account.id) {
        await prisma.business.update({
          where: { id: business.id },
          data: { stripeAccountId: account.id },
        });
      }
    } else {
      // They didn't finish onboarding
      requireAdditionalDetails = true;
    }
  } else if (business.stripeAccountId) {
    // Check their existing saved account
    const account = await stripe.accounts.retrieve(business.stripeAccountId);
    if (account.details_submitted) {
      isConnected = true;
    } else {
      requireAdditionalDetails = true;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Track payments and manage your Stripe account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">$0.00</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-medium text-muted-foreground">This Month</p>
          <p className="text-3xl font-bold mt-1">$0.00</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-medium text-muted-foreground">Pending</p>
          <p className="text-3xl font-bold mt-1">$0.00</p>
        </div>
      </div>

      {!isConnected ? (
        <div className="rounded-xl border bg-white p-8 text-center max-w-2xl mx-auto mt-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            💳
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
        <EmptyState
          title="Stripe is Connected!"
          description="Your Stripe account is fully set up. You can now accept payments."
          icon="check-circle"
        />
      )}
    </div>
  );
}
