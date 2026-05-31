export interface Business {
  id: string;
  userId: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  timezone: string;
  country: string;
  workingHours: WorkingHours;
  bufferMinutes: number;
  bookingWindowDays: number;
  cancellationHours: number;
  noShowFee?: number | null;
  depositPercent?: number | null;
  stripeAccountId?: string | null;
  googlePlaceId?: string | null;
  reviewsEnabled: boolean;
  createdAt: Date;
}

export interface WorkingHours {
  [day: string]: {
    enabled: boolean;
    start: string; // "09:00"
    end: string;   // "17:00"
    breaks?: { start: string; end: string }[];
  };
}

export interface CreateBusinessInput {
  name: string;
  slug: string;
  category: string;
  timezone: string;
  country: string;
  description?: string;
  workingHours: WorkingHours;
}

export interface UpdateBusinessInput extends Partial<CreateBusinessInput> {
  logoUrl?: string;
  coverUrl?: string;
  bufferMinutes?: number;
  bookingWindowDays?: number;
  cancellationHours?: number;
  noShowFee?: number;
  depositPercent?: number;
  reviewsEnabled?: boolean;
}
