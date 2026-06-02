"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/posthog";

export function StripeConnectTracker({ accountId }: { accountId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      track({ event: "stripe_connected", properties: { accountId } });
      tracked.current = true;
    }
  }, [accountId]);

  return null;
}
