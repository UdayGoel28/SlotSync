"use client";

import { useState, useEffect } from "react";
import type { BookingWithDetails } from "@slotsync/types";

export function useBookings() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (params?: { from?: string; to?: string; status?: string }) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (params?.from) searchParams.set("from", params.from);
      if (params?.to) searchParams.set("to", params.to);
      if (params?.status) searchParams.set("status", params.status);

      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/bookings?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, loading, error, refetch: fetchBookings };
}
