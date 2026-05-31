"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    setSubmitted(true);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-brand-600 to-brand-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white">
          Ready to streamline your bookings?
        </h2>
        <p className="mt-4 text-lg text-brand-100 max-w-xl mx-auto">
          Join the waitlist and be the first to know when we launch in your area.
        </p>

        {submitted ? (
          <div className="mt-8 inline-flex items-center gap-2 bg-white/10 rounded-full px-6 py-3 text-white">
            <span>✓</span> You&apos;re on the list! We&apos;ll be in touch.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full sm:flex-1 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-white px-6 py-3 text-sm font-medium text-brand-700 hover:bg-brand-50 transition-colors"
            >
              Join Waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
