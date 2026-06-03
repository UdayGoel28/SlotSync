import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile/ProfileForm";
import { BusinessHoursForm } from "@/components/dashboard/profile/BusinessHoursForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });

  if (!business) {
    redirect("/onboarding");
  }

  const businessData = {
    name: business.name,
    category: business.category,
    description: business.description,
    address: business.address,
    phone: business.phone,
    website: business.website,
    logoUrl: business.logoUrl,
    coverUrl: business.coverUrl,
    googlePlaceId: business.googlePlaceId,
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Business Profile</h1>
        <p className="text-muted-foreground">
          Manage your business identity, contact details, and working hours.
        </p>
      </div>

      <ProfileForm business={businessData} />

      <BusinessHoursForm initialHours={business.workingHours} />
    </div>
  );
}
