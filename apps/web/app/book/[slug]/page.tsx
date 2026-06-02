import { notFound } from "next/navigation";
import { prisma } from "@slotsync/database";
import { BookingFlow } from "./BookingFlow";
import { BusinessProfileHero } from "@/components/booking/BusinessProfileHero";
import { Reviews3DStack, Review } from "@/components/booking/Reviews3DStack";

interface BookingPageProps {
  params: Promise<{ slug: string }>;
}

async function getGoogleReviews(placeId: string | null): Promise<Review[]> {
  if (!placeId || !process.env.GOOGLE_PLACES_API_KEY) return [];
  
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      { next: { revalidate: 3600 * 24 } } // cache for 24 hours
    );
    const data = await res.json();
    if (data.result && data.result.reviews) {
      return data.result.reviews.filter((r: any) => r.rating >= 4).slice(0, 5);
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    return [];
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: true,
      staff: true,
    }
  });

  if (!business) {
    notFound();
  }
  
  const reviews = await getGoogleReviews(business.googlePlaceId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EDE6] via-[#F5F0EA] to-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#F2A99A]/40 to-[#F7C4BC]/0 blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#E8EDE6]/80 to-white/0 blur-3xl -z-10" />

      <div className="container mx-auto max-w-2xl py-12 px-4 relative z-0">
        <BusinessProfileHero 
          name={business.name}
          description={business.description}
          logoUrl={business.logoUrl}
          coverUrl={business.coverUrl}
        />

        <div className="mb-12">
          <BookingFlow business={business} />
        </div>

        {reviews.length > 0 && (
          <div className="mt-16">
            <Reviews3DStack reviews={reviews} />
          </div>
        )}
      </div>
    </div>
  );
}
