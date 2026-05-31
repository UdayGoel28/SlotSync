"use client";

import { useState, useEffect } from "react";
import type { Booking } from "@slotsync/types";

export function useClients() {
  const [clients, setClients] = useState<Partial<Booking>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/clients`);
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return { clients, loading, error };
}
