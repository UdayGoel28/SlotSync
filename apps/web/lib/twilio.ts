import twilio from "twilio";

// Safe initialisation — avoids crashing during Next.js build
// when env vars aren't present in the build environment.
const accountSid = process.env.TWILIO_ACCOUNT_SID ?? "AC_dummy_build_sid";
const authToken = process.env.TWILIO_AUTH_TOKEN ?? "dummy_build_token";

export const twilioClient = twilio(accountSid, authToken);

export const TWILIO_PHONE_NUMBER =
  process.env.TWILIO_PHONE_NUMBER ?? "";
