"use server";

import { createClient } from "@/lib/supabase/server";

export async function joinWaitlist(formData: { email: string; businessType: string; country: string }) {
  // If we are using dummy keys, simulate success to allow flawless UI testing
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !anonKey || anonKey.includes("dummy") || url.includes("dummy")) {
    console.warn("⚠️ Supabase keys are not set or are placeholder dummy keys. Simulating waitlist success.");
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("waitlist").insert({
      email: formData.email,
      business_type: formData.businessType,
      country: formData.country,
    });

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Waitlist error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
