export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  staffId?: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  stripePaymentIntentId?: string | null;
  reminderSent24hr: boolean;
  reminderSent2hr: boolean;
  reviewRequestSent: boolean;
  createdAt: Date;
}

export type BookingStatus =
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no-show"
  | "pending";

export interface CreateBookingInput {
  businessId: string;
  serviceId: string;
  staffId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startTime: string;
  endTime: string;
}

export interface BookingWithDetails extends Booking {
  service: {
    name: string;
    durationMinutes: number;
    price: number;
  };
  staff?: {
    name: string;
    photoUrl?: string | null;
  } | null;
}
