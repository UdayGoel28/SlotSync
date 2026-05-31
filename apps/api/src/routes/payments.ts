import { Hono } from "hono";
import { stripe } from "../lib/stripe";
import { prisma } from "../lib/db";

export const paymentRoutes = new Hono();

paymentRoutes.post("/create-intent", async (c) => {
  const { bookingId, amount } = await c.req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    metadata: { bookingId },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return c.json({ clientSecret: paymentIntent.client_secret });
});

paymentRoutes.post("/connect/onboard", async (c) => {
  const userId = c.get("userId" as never);
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) return c.json({ error: "Business not found" }, 404);

  const account = await stripe.accounts.create({ type: "express" });

  await prisma.business.update({
    where: { id: business.id },
    data: { stripeAccountId: account.id },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?stripe=success`,
    type: "account_onboarding",
  });

  return c.json({ url: accountLink.url });
});
