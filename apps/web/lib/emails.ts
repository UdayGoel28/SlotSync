import { resend } from "./resend";
import { format, addMinutes } from "date-fns";

/* ─── Shared types ─── */
export type BookingEmailData = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  serviceDuration: number; // minutes
  servicePrice: number;
  businessName: string;
  businessEmail: string;
  businessLogoUrl?: string | null;
  businessSlug?: string;
  startTime: Date;
  bookingId: string;
  paymentStatus?: "paid" | "pending" | "free";
};

const SENDER_EMAIL = "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://slot-sync01.vercel.app";

/* ─── Shared styles ─── */
const BRAND_COLOR = "#D4846A";
const BRAND_LIGHT = "#F7C4BC";
const BG_COLOR = "#FAF9F7";
const TEXT_COLOR = "#2C2C2C";
const TEXT_MUTED = "#8A8A8A";

function emailWrapper(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:${BG_COLOR}; font-family:'DM Sans','Helvetica Neue',Arial,sans-serif; color:${TEXT_COLOR};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #f0ede8;">
        ${content}
      </table>
      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:24px 0; text-align:center;">
          <p style="margin:0; font-size:12px; color:${TEXT_MUTED};">Powered by <a href="${APP_URL}" style="color:${BRAND_COLOR}; text-decoration:none;">SlotSync</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function logoHeader(businessName: string, logoUrl?: string | null) {
  const logo = logoUrl
    ? `<img src="${logoUrl}" alt="${businessName}" style="height:40px; border-radius:8px; margin-bottom:8px;" />`
    : `<div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,${BRAND_LIGHT},${BRAND_COLOR});display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:600;margin-bottom:8px;">${businessName.charAt(0)}</div>`;
  return `
    <tr><td style="padding:32px 32px 0; text-align:center;">
      ${logo}
      <p style="margin:4px 0 0; font-size:14px; font-weight:600; color:${TEXT_COLOR};">${businessName}</p>
    </td></tr>`;
}

function buildGoogleCalendarUrl(data: BookingEmailData): string {
  const start = new Date(data.startTime);
  const end = addMinutes(start, data.serviceDuration);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${data.serviceName} at ${data.businessName}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Booking with ${data.businessName}. Manage: ${APP_URL}/manage-booking/${data.bookingId}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ═══════════════════════════════════════════════════════
   1. CLIENT CONFIRMATION
═══════════════════════════════════════════════════════ */
export async function sendClientConfirmationEmail(data: BookingEmailData) {
  const formattedDate = format(new Date(data.startTime), "EEEE, MMMM do, yyyy");
  const formattedTime = format(new Date(data.startTime), "h:mm a");
  const manageLink = `${APP_URL}/manage-booking/${data.bookingId}`;
  const calendarLink = buildGoogleCalendarUrl(data);
  const priceDisplay = data.servicePrice > 0 ? `$${data.servicePrice.toFixed(2)}` : "Free";
  const paymentLabel = data.paymentStatus === "paid" ? "Paid ✓" : data.paymentStatus === "pending" ? "Payment pending" : "No charge";

  const html = emailWrapper(`
    ${logoHeader(data.businessName, data.businessLogoUrl)}
    <tr><td style="padding:24px 32px 0; text-align:center;">
      <h1 style="margin:0 0 4px; font-size:22px; font-weight:400; font-family:'Georgia',serif; color:${TEXT_COLOR};">Your booking is confirmed ✓</h1>
      <p style="margin:0; font-size:14px; color:${TEXT_MUTED};">Hi ${data.clientName}, you're all set.</p>
    </td></tr>
    <!-- Details card -->
    <tr><td style="padding:24px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG_COLOR}; border-radius:12px; border:1px solid #f0ede8;">
        <tr><td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_MUTED};">Service</td>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${data.serviceName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_MUTED};">Date</td>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_MUTED};">Time</td>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_MUTED};">Duration</td>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${data.serviceDuration} min</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 0 0; border-top:1px solid #f0ede8;"></td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_MUTED};">Price</td>
              <td style="padding:6px 0; font-size:14px; color:${TEXT_COLOR}; text-align:right; font-weight:600;">${priceDisplay}</td>
            </tr>
            <tr>
              <td style="padding:2px 0; font-size:12px; color:${TEXT_MUTED};">Status</td>
              <td style="padding:2px 0; font-size:12px; color:${BRAND_COLOR}; text-align:right;">${paymentLabel}</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
    <!-- Buttons -->
    <tr><td style="padding:0 32px 12px; text-align:center;">
      <a href="${calendarLink}" style="display:inline-block; background:${BRAND_COLOR}; color:#ffffff; padding:12px 28px; border-radius:10px; text-decoration:none; font-size:13px; font-weight:600; margin-right:8px;">
        Add to Google Calendar
      </a>
    </td></tr>
    <tr><td style="padding:0 32px 32px; text-align:center;">
      <a href="${manageLink}" style="display:inline-block; border:1px solid #e0d8cf; color:${TEXT_COLOR}; padding:10px 24px; border-radius:10px; text-decoration:none; font-size:13px; font-weight:500;">
        Cancel or Reschedule
      </a>
    </td></tr>
  `);

  try {
    const { data: response, error } = await resend.emails.send({
      from: `${data.businessName} via SlotSync <${SENDER_EMAIL}>`,
      to: [data.clientEmail],
      subject: `Your booking is confirmed ✓ — ${data.businessName}`,
      html,
    });
    if (error) console.error("Client confirmation email error:", error);
    return { response, error };
  } catch (err) {
    console.error("Client confirmation email exception:", err);
    return { error: err };
  }
}

/* ═══════════════════════════════════════════════════════
   2. BUSINESS OWNER NOTIFICATION
═══════════════════════════════════════════════════════ */
export async function sendBusinessNotificationEmail(data: BookingEmailData) {
  const formattedDate = format(new Date(data.startTime), "EEEE, MMMM do, yyyy");
  const formattedTime = format(new Date(data.startTime), "h:mm a");
  const paymentLabel = data.paymentStatus === "paid" ? "✓ Paid" : data.paymentStatus === "pending" ? "⏳ Pending" : "Free";

  const html = emailWrapper(`
    <tr><td style="padding:32px 32px 0; text-align:center;">
      <div style="width:40px;height:40px;border-radius:50%;background:#E8EDE6;display:inline-flex;align-items:center;justify-content:center;margin-bottom:8px;">
        <span style="font-size:20px;">🎉</span>
      </div>
      <h1 style="margin:8px 0 4px; font-size:22px; font-weight:400; font-family:'Georgia',serif; color:${TEXT_COLOR};">New booking from ${data.clientName}</h1>
      <p style="margin:0; font-size:14px; color:${TEXT_MUTED};">You have a new appointment.</p>
    </td></tr>
    <!-- Booking details -->
    <tr><td style="padding:24px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG_COLOR}; border-radius:12px; border:1px solid #f0ede8;">
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 12px; font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:${TEXT_MUTED}; font-weight:600;">Booking Details</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_MUTED};">Service</td>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${data.serviceName}</td>
            </tr>
            <tr>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_MUTED};">Date</td>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_MUTED};">Time</td>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_MUTED};">Payment</td>
              <td style="padding:5px 0; font-size:13px; color:${BRAND_COLOR}; text-align:right; font-weight:500;">${paymentLabel}</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
    <!-- Client info -->
    <tr><td style="padding:0 32px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG_COLOR}; border-radius:12px; border:1px solid #f0ede8;">
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 12px; font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:${TEXT_MUTED}; font-weight:600;">Client Information</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_MUTED};">Name</td>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${data.clientName}</td>
            </tr>
            <tr>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_MUTED};">Email</td>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right;">
                <a href="mailto:${data.clientEmail}" style="color:${BRAND_COLOR}; text-decoration:none;">${data.clientEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_MUTED};">Phone</td>
              <td style="padding:5px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right;">
                <a href="tel:${data.clientPhone}" style="color:${BRAND_COLOR}; text-decoration:none;">${data.clientPhone}</a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  `);

  try {
    const { data: response, error } = await resend.emails.send({
      from: `SlotSync <${SENDER_EMAIL}>`,
      to: [data.businessEmail],
      subject: `New booking from ${data.clientName}`,
      html,
    });
    if (error) console.error("Business notification email error:", error);
    return { response, error };
  } catch (err) {
    console.error("Business notification email exception:", err);
    return { error: err };
  }
}

/* ═══════════════════════════════════════════════════════
   3. CLIENT REMINDER (24hrs before)
   — Will be triggered by Inngest later
═══════════════════════════════════════════════════════ */
export async function sendBookingReminderEmail(data: BookingEmailData) {
  const formattedTime = format(new Date(data.startTime), "h:mm a");
  const manageLink = `${APP_URL}/manage-booking/${data.bookingId}`;

  const html = emailWrapper(`
    ${logoHeader(data.businessName, data.businessLogoUrl)}
    <tr><td style="padding:24px 32px 0; text-align:center;">
      <h1 style="margin:0 0 4px; font-size:22px; font-weight:400; font-family:'Georgia',serif; color:${TEXT_COLOR};">Reminder: Your appointment tomorrow</h1>
      <p style="margin:0; font-size:14px; color:${TEXT_MUTED};">Hi ${data.clientName}, just a friendly reminder.</p>
    </td></tr>
    <tr><td style="padding:24px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG_COLOR}; border-radius:12px; border:1px solid #f0ede8;">
        <tr><td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_MUTED};">Service</td>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${data.serviceName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_MUTED};">Time</td>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">Tomorrow at ${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_MUTED};">Location</td>
              <td style="padding:6px 0; font-size:13px; color:${TEXT_COLOR}; text-align:right; font-weight:500;">${data.businessName}</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:0 32px 32px; text-align:center;">
      <p style="font-size:13px; color:${TEXT_MUTED}; margin:0 0 16px;">Need to cancel?</p>
      <a href="${manageLink}" style="display:inline-block; border:1px solid #e0d8cf; color:${TEXT_COLOR}; padding:10px 24px; border-radius:10px; text-decoration:none; font-size:13px; font-weight:500;">
        Cancel or Reschedule
      </a>
    </td></tr>
  `);

  try {
    const { data: response, error } = await resend.emails.send({
      from: `${data.businessName} via SlotSync <${SENDER_EMAIL}>`,
      to: [data.clientEmail],
      subject: `Reminder: Your appointment tomorrow`,
      html,
    });
    if (error) console.error("Reminder email error:", error);
    return { response, error };
  } catch (err) {
    console.error("Reminder email exception:", err);
    return { error: err };
  }
}
