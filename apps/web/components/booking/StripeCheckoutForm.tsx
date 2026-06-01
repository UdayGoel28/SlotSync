"use client";

import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe outside of component to avoid recreating the object on every render
// Only initialize if the key exists to prevent crashes in environments where it's missing
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

export function StripeCheckoutWrapper({ 
  clientSecret, 
  onSuccess 
}: { 
  clientSecret: string;
  onSuccess: () => void;
}) {
  if (!stripePromise) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
        <p className="font-medium">Payment system is currently unavailable.</p>
        <p className="text-sm mt-1">Please contact the business directly to arrange payment.</p>
        <button 
          onClick={onSuccess}
          className="mt-4 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-lg text-sm font-medium transition-colors"
        >
          Complete Booking Without Payment
        </button>
      </div>
    );
  }

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
