import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { redirect } from "next/navigation";
import { BookingLinkHeader } from "@/components/dashboard/setup/BookingLinkHeader";
import { ServicesManager } from "@/components/dashboard/setup/ServicesManager";
import { StaffManager } from "@/components/dashboard/setup/StaffManager";
import { BusinessSettingsForm } from "@/components/dashboard/setup/BusinessSettingsForm";

export default async function SetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
    include: {
      services: true,
      staff: true,
    }
  });

  if (!business) {
    redirect("/onboarding");
  }

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Booking Page Setup</h1>
        <p className="text-muted-foreground">
          Customize your public booking page and share it with clients.
        </p>
      </div>

      <BookingLinkHeader slug={business.slug} />

      <ServicesManager initialServices={business.services} />
      
      <StaffManager initialStaff={business.staff} />
      
      <BusinessSettingsForm business={business} />
    </div>
  );
}
