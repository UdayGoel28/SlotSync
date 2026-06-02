import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "slotsync",
  name: "SlotSync",
});

/* ─── Event types ─── */
export type BookingCreatedEvent = {
  name: "booking/created";
  data: {
    bookingId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    serviceName: string;
    serviceDuration: number;
    servicePrice: number;
    businessName: string;
    businessEmail: string;
    businessLogoUrl: string | null;
    businessSlug: string;
    googlePlaceId: string | null;
    startTime: string; // ISO string — Inngest payloads are JSON-serialized
    endTime: string;
  };
};

export type BookingCompletedEvent = {
  name: "booking/completed";
  data: {
    bookingId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    businessName: string;
    businessEmail: string;
    businessLogoUrl: string | null;
    googlePlaceId: string | null;
    endTime: string; // ISO string
  };
};

export type Events = BookingCreatedEvent | BookingCompletedEvent;
