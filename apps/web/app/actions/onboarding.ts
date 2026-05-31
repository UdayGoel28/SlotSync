"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface OnboardingData {
  businessName: string;
  category: string;
  country: string;
  workingHours: any; // We'll type this properly later, using any for quick JSONB insert
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to complete onboarding." };
  }

  // Generate a simple slug from the business name
  const baseSlug = data.businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  
  let slug = baseSlug;
  let counter = 1;

  // Make sure the slug is unique
  while (true) {
    const existing = await prisma.business.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  try {
    // Check if user already has a business to avoid unique constraint violations
    const existingBusiness = await prisma.business.findUnique({
      where: { userId: user.id }
    });

    if (existingBusiness) {
      return { error: "You have already completed onboarding." };
    }

    // Default timezone based on country for now (can be made dynamic later)
    const timezone = data.country === "United States" ? "America/New_York" : "UTC";

    await prisma.business.create({
      data: {
        userId: user.id,
        name: data.businessName,
        category: data.category,
        country: data.country,
        slug,
        timezone,
        workingHours: data.workingHours,
        bufferMinutes: 0,
        bookingWindowDays: 30,
        cancellationHours: 24,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, slug };
  } catch (error: any) {
    console.error("Failed to complete onboarding:", error);
    return { error: "An unexpected error occurred while saving your business. Please try again." };
  }
}
