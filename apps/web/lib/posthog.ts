"use client";

import posthog from "posthog-js";

// ── Init (browser-only, idempotent) ──────────────────────────────────────────
if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY &&
  !posthog.__loaded
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    // Don't track in development unless explicitly enabled
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.opt_out_capturing();
    },
  });
}

// ── Typed event catalogue ─────────────────────────────────────────────────────
export type AnalyticsEvent =
  | { event: "user_signed_up"; properties?: { email?: string; name?: string } }
  | { event: "onboarding_completed"; properties?: { businessName?: string; category?: string } }
  | { event: "booking_created"; properties?: { serviceName?: string; servicePrice?: number; businessSlug?: string } }
  | { event: "stripe_connected"; properties?: { accountId?: string } }
  | { event: "review_request_sent"; properties?: { businessId?: string; googlePlaceId?: string } };

/**
 * Track a product analytics event.
 * Safe to call — no-ops if PostHog isn't initialised.
 */
export function track(payload: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  posthog.capture(payload.event, payload.properties ?? {});
}

/**
 * Identify an authenticated user so events are tied to their profile.
 */
export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  posthog.identify(userId, traits);
}

/**
 * Clear the session on logout.
 */
export function reset(): void {
  if (typeof window === "undefined") return;
  posthog.reset();
}

export { posthog };
