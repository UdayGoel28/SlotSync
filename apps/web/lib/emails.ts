import { resend } from "./resend";
import { format } from "date-fns";

export type BookingEmailData = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  businessName: string;
  businessEmail: string; // Used to notify the owner
  startTime: Date;
  bookingId: string;
};

// We will use the default onboarding@resend.dev for testing. 
// Note: In test mode, this will only deliver to the email you used to sign up for Resend.
const SENDER_EMAIL = "onboarding@resend.dev";

export async function sendClientConfirmationEmail(data: BookingEmailData) {
  const formattedDate = format(new Date(data.startTime), "EEEE, MMMM do, yyyy 'at' h:mm a");
  // For the moment, we just point them back to the app URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const manageLink = `${appUrl}/manage-booking/${data.bookingId}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #635BFF;">Your booking is confirmed!</h2>
      <p>Hi ${data.clientName},</p>
      <p>Your appointment at <strong>${data.businessName}</strong> has been successfully booked.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${data.serviceName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
      </div>

      <p>If you need to cancel or reschedule, please click the link below:</p>
      <p>
        <a href="${manageLink}" style="display: inline-block; background-color: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Manage Booking
        </a>
      </p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Thanks,<br>
        The ${data.businessName} Team via SlotSync
      </p>
    </div>
  `;

  try {
    const { data: response, error } = await resend.emails.send({
      from: `SlotSync <${SENDER_EMAIL}>`,
      to: [data.clientEmail],
      subject: `Your booking is confirmed - ${data.businessName}`,
      html: html,
    });

    if (error) {
      console.error("Failed to send client confirmation email:", error);
    }
    return { response, error };
  } catch (err) {
    console.error("Error sending client confirmation email:", err);
    return { error: err };
  }
}

export async function sendBusinessNotificationEmail(data: BookingEmailData) {
  const formattedDate = format(new Date(data.startTime), "EEEE, MMMM do, yyyy 'at' h:mm a");

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #10b981;">New Booking Received! 🎉</h2>
      <p>You have a new appointment scheduled.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Booking Details</h3>
        <p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${data.serviceName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
        
        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">Client Information</h3>
        <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${data.clientName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.clientEmail}</p>
        <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${data.clientPhone}</p>
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        SlotSync Notifications
      </p>
    </div>
  `;

  try {
    const { data: response, error } = await resend.emails.send({
      from: `SlotSync <${SENDER_EMAIL}>`,
      to: [data.businessEmail],
      subject: `New booking: ${data.serviceName} with ${data.clientName}`,
      html: html,
    });

    if (error) {
      console.error("Failed to send business notification email:", error);
    }
    return { response, error };
  } catch (err) {
    console.error("Error sending business notification email:", err);
    return { error: err };
  }
}
