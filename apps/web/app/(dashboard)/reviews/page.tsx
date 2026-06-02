import { createClient } from "@/lib/supabase/server";
import { prisma } from "@slotsync/database";
import { ReviewsSettingsClient } from "@/components/dashboard/reviews/ReviewsSettingsClient";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });

  // Count review requests sent this month
  const reviewsSentThisMonth = business
    ? await prisma.booking.count({
        where: {
          businessId: business.id,
          reviewRequestSent: true,
          createdAt: {
            gte: startOfMonth(new Date()),
            lte: endOfMonth(new Date()),
          },
        },
      })
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground">
          Automate Google review requests after every appointment.
        </p>
      </div>

      <ReviewsSettingsClient
        googlePlaceId={business?.googlePlaceId ?? null}
        reviewsEnabled={business?.reviewsEnabled ?? false}
        businessName={business?.name ?? "your business"}
        reviewsSentThisMonth={reviewsSentThisMonth}
      />
    </div>
  );
}
