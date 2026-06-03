"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { revalidatePath } from "next/cache";

async function getBusinessForUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.business.findUnique({
    where: { userId: user.id }
  });
}

// --- SERVICES ---

export async function addService(data: { name: string; durationMinutes: number; price: number; description?: string }) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.service.create({
      data: {
        ...data,
        businessId: business.id,
      }
    });
    revalidatePath("/setup");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add service" };
  }
}

export async function updateService(id: string, data: { name: string; durationMinutes: number; price: number; description?: string; isActive: boolean }) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.service.update({
      where: { id, businessId: business.id },
      data
    });
    revalidatePath("/setup");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update service" };
  }
}

export async function deleteService(id: string) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.service.delete({
      where: { id, businessId: business.id }
    });
    revalidatePath("/setup");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete service" };
  }
}

// --- STAFF ---

export async function addStaff(data: { name: string; photoUrl?: string }) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.staff.create({
      data: {
        ...data,
        businessId: business.id,
        workingHours: business.workingHours ? JSON.parse(JSON.stringify(business.workingHours)) : {}, // Inherit business hours by default
      }
    });
    revalidatePath("/setup");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add staff" };
  }
}

export async function updateStaff(id: string, data: { name: string; isActive: boolean; workingHours: any; photoUrl?: string }) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.staff.update({
      where: { id, businessId: business.id },
      data
    });
    revalidatePath("/setup");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update staff" };
  }
}

export async function deleteStaff(id: string) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.staff.delete({
      where: { id, businessId: business.id }
    });
    revalidatePath("/setup");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete staff" };
  }
}

// --- BUSINESS SETTINGS ---

export async function updateBusinessSettings(data: { bufferMinutes: number; bookingWindowDays: number; cancellationHours: number }) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.business.update({
      where: { id: business.id },
      data
    });
    revalidatePath("/setup");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update business settings" };
  }
}

export async function updateBusinessProfile(data: { 
  name: string; 
  category: string;
  description?: string; 
  address?: string;
  phone?: string;
  website?: string;
  logoUrl?: string; 
  coverUrl?: string;
  googlePlaceId?: string;
}) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.business.update({
      where: { id: business.id },
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        address: data.address,
        phone: data.phone,
        website: data.website,
        logoUrl: data.logoUrl,
        coverUrl: data.coverUrl,
        googlePlaceId: data.googlePlaceId,
      }
    });
    revalidatePath("/profile");
    revalidatePath(`/business/${business.slug}`);
    revalidatePath(`/book/${business.slug}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update business profile" };
  }
}

export async function updateWorkingHours(workingHours: any) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.business.update({
      where: { id: business.id },
      data: { workingHours }
    });
    revalidatePath("/profile");
    revalidatePath(`/business/${business.slug}`);
    revalidatePath(`/book/${business.slug}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update working hours" };
  }
}

// --- REVIEW SETTINGS ---

export async function updateReviewSettings(data: {
  googlePlaceId: string | null;
  reviewsEnabled: boolean;
}) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  try {
    await prisma.business.update({
      where: { id: business.id },
      data: {
        googlePlaceId: data.googlePlaceId || null,
        reviewsEnabled: data.reviewsEnabled,
      },
    });
    revalidatePath("/reviews");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update review settings" };
  }
}
