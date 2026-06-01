"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";

export async function createStripeConnectAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });

  if (!business) {
    throw new Error("Business not found");
  }

  // Use the App URL from env, default to localhost for dev
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  let accountId = business.stripeAccountId;

  // If we don't have a Stripe account yet, create one
  if (!accountId) {
    const account = await stripe.accounts.create({ type: "express" });
    accountId = account.id;
    
    // Save it immediately as pending (in case they drop off)
    await prisma.business.update({
      where: { id: business.id },
      data: { stripeAccountId: accountId },
    });
  }

  // Create an Account Link for onboarding
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${baseUrl}/payments`,
    return_url: `${baseUrl}/payments?connected=true&account_id=${accountId}`,
    type: "account_onboarding",
  });

  redirect(accountLink.url);
}
