"use client";

import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe outside of component to avoid recreating the object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function StripeCheckoutWrapper({ 
  clientSecret, 
  onSuccess 
}: { 
  clientSecret: string;
  onSuccess: () => void;
}) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeCheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
}

function StripeCheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // Submit elements first
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "An error occurred");
      setLoading(false);
      return;
    }

    // Confirm payment (no redirect needed if we handle it directly, but Stripe often prefers return_url)
    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe requires a return_url even if redirect="if_required", but we'll try to stay on page
        return_url: `${window.location.origin}/book/success`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "An error occurred during payment confirmation.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full rounded-lg bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
