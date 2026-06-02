import { twilioClient, TWILIO_PHONE_NUMBER } from "./twilio";
import { format } from "date-fns";

/* ─────────────────────────────────────────────
   Shared types
───────────────────────────────────────────── */
export type BookingSmsData = {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  businessName: string;
  googlePlaceId?: string | null;
  startTime: Date;
  bookingId: string;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://slot-sync01.vercel.app";

/**
 * Checks whether the Twilio credentials and phone number are properly
 * configured. Logs a warning and returns false if not, so callers can
 * skip SMS sending gracefully (e.g. during local dev / build).
 */
function isTwilioConfigured(): boolean {
  if (!TWILIO_PHONE_NUMBER || TWILIO_PHONE_NUMBER === "") {
    console.warn("⚠️  TWILIO_PHONE_NUMBER is not set — skipping SMS.");
    return false;
  }
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    process.env.TWILIO_ACCOUNT_SID.startsWith("AC_dummy")
  ) {
    console.warn("⚠️  Twilio credentials not configured — skipping SMS.");
    return false;
  }
  return true;
}

/**
 * Normalises a phone number to E.164 format.
 * Handles common formats like (555) 123-4567, +1-555-123-4567, etc.
 * Falls back to the raw value if it already looks correct.
 */
function toE164(phone: string): string {
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, "");
  // US numbers: 10 digits → prepend +1
  if (digits.length === 10) return `+1${digits}`;
  // Already has country code (11+ digits) → prepend +
  if (digits.length >= 11) return `+${digits}`;
  // Already in E.164 form
  return phone;
}

/* ═══════════════════════════════════════════════════════
   1. BOOKING CONFIRMATION SMS
   Triggered immediately after booking is confirmed.
═══════════════════════════════════════════════════════ */
export async function sendBookingConfirmationSms(
  data: BookingSmsData
): Promise<void> {
  if (!isTwilioConfigured()) return;

  const date = format(new Date(data.startTime), "EEE, MMM do");
  const time = format(new Date(data.startTime), "h:mm a");
  const cancelLink = `${APP_URL}/manage-booking/${data.bookingId}`;

  const body =
    `Hi ${data.clientName}! Your ${data.serviceName} at ` +
    `${data.businessName} is confirmed for ${date} at ${time}. ` +
    `Manage booking: ${cancelLink}`;

  try {
    const message = await twilioClient.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to: toE164(data.clientPhone),
    });
    console.log(`✅ Confirmation SMS sent: ${message.sid}`);
  } catch (err) {
    console.error("❌ Failed to send confirmation SMS:", err);
  }
}

/* ═══════════════════════════════════════════════════════
   2. 2-HOUR REMINDER SMS
   Triggered by Inngest ~2 hours before appointment.
═══════════════════════════════════════════════════════ */
export async function sendTwoHourReminderSms(
  data: BookingSmsData
): Promise<void> {
  if (!isTwilioConfigured()) return;

  const time = format(new Date(data.startTime), "h:mm a");

  const body =
    `Reminder: Your ${data.serviceName} at ${data.businessName} ` +
    `is in 2 hours (${time}). See you soon! 👋`;

  try {
    const message = await twilioClient.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to: toE164(data.clientPhone),
    });
    console.log(`✅ 2hr reminder SMS sent: ${message.sid}`);
  } catch (err) {
    console.error("❌ Failed to send 2hr reminder SMS:", err);
  }
}

/* ═══════════════════════════════════════════════════════
   3. GOOGLE REVIEW REQUEST SMS
   Triggered by Inngest ~1 hour after appointment ends.
═══════════════════════════════════════════════════════ */
export async function sendReviewRequestSms(
  data: BookingSmsData
): Promise<void> {
  if (!isTwilioConfigured()) return;

  // Build the Google review link. Falls back to a Google search
  // for the business name if no Place ID is configured.
  const reviewLink = data.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${data.googlePlaceId}`
    : `https://www.google.com/search?q=${encodeURIComponent(data.businessName)}+reviews`;

  const body =
    `Thanks for visiting ${data.businessName}! ` +
    `Mind leaving us a quick review? It means a lot 🙏\n${reviewLink}`;

  try {
    const message = await twilioClient.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to: toE164(data.clientPhone),
    });
    console.log(`✅ Review request SMS sent: ${message.sid}`);
  } catch (err) {
    console.error("❌ Failed to send review request SMS:", err);
  }
}
