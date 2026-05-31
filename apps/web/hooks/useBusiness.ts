"use client";

import { useState, useEffect } from "react";
import type { Business } from "@slotsync/types";

export function useBusiness() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/businesses`);
        if (!res.ok) throw new Error("Failed to fetch business");
        const data = await res.json();
        setBusiness(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, []);

  return { business, loading, error };
}
