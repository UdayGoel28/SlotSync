"use server";

import { prisma } from "@slotsync/database";

export async function joinWaitlist(formData: { email: string; businessType: string; country: string }) {
  try {
    await prisma.waitlist.create({
      data: {
        email: formData.email,
        businessType: formData.businessType,
        country: formData.country,
      }
    });

    return { success: true };
  } catch (err: any) {
    console.error("Waitlist error:", err);
    // Handle unique constraint error if they already joined
    if (err.code === 'P2002') {
      return { success: false, error: "This email is already on the waitlist." };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}
