"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";

async function getBusinessForUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.business.findUnique({ where: { userId: user.id } });
}

export async function getClientNote(clientEmail: string) {
  const business = await getBusinessForUser();
  if (!business) return { notes: "" };

  const note = await prisma.clientNote.findUnique({
    where: {
      businessId_clientEmail: {
        businessId: business.id,
        clientEmail,
      },
    },
  });

  return { notes: note?.notes || "" };
}

export async function saveClientNote(clientEmail: string, notes: string) {
  const business = await getBusinessForUser();
  if (!business) return { error: "Business not found" };

  await prisma.clientNote.upsert({
    where: {
      businessId_clientEmail: {
        businessId: business.id,
        clientEmail,
      },
    },
    update: { notes },
    create: {
      businessId: business.id,
      clientEmail,
      notes,
    },
  });

  return { success: true };
}

export async function updateCustomerInfo(originalEmail: string, data: { name: string; phone: string }) {
  try {
    // Update all bookings associated with this email
    await prisma.booking.updateMany({
      where: { clientEmail: originalEmail },
      data: {
        clientName: data.name,
        clientPhone: data.phone,
      }
    });
    
    // We don't update the email itself because the portal URL depends on the email as the ID.
    // Changing the email would break their current portal link.

    return { success: true };
  } catch (err) {
    return { error: "Failed to update contact info" };
  }
}
