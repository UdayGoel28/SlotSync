import { notFound } from "next/navigation";
import { prisma } from "@slotsync/database";
import Link from "next/link";
import { BusinessProfileHero } from "@/components/booking/BusinessProfileHero";
import { Reviews3DStack, Review } from "@/components/booking/Reviews3DStack";

interface BusinessPageProps {
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

export default async function BusinessProfilePage({ params }: BusinessPageProps) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: true,
    }
  });

  if (!business) {
    notFound();
  }
  
  const reviews = await getGoogleReviews(business.googlePlaceId);
  const activeServices = business.services.filter(s => s.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EDE6] via-[#F5F0EA] to-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#F2A99A]/40 to-[#F7C4BC]/0 blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#E8EDE6]/80 to-white/0 blur-3xl -z-10" />

      <div className="container mx-auto max-w-3xl py-12 px-4 relative z-0 pb-32">
        <BusinessProfileHero 
          name={business.name}
          description={business.category}
          logoUrl={business.logoUrl}
          coverUrl={business.coverUrl}
        />

        <div className="mt-8 space-y-8">
          
          {/* About Section */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8">
            <h2 className="text-2xl font-serif font-light text-[#2C2C2C] mb-4">About</h2>
            {business.description && (
              <p className="text-sm text-[#2C2C2C]/80 leading-relaxed mb-6 whitespace-pre-wrap">
                {business.description}
              </p>
            )}

            <div className="space-y-3 text-sm text-[#2C2C2C]/60">
              {business.address && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <span>{business.address}</span>
                </div>
              )}
              {business.phone && (
                <div className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <span>{business.phone}</span>
                </div>
              )}
              {business.website && (
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-[#D4846A] hover:underline">
                    {business.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8">
            <h2 className="text-2xl font-serif font-light text-[#2C2C2C] mb-6">Services</h2>
            <div className="space-y-3">
              {activeServices.length > 0 ? (
                activeServices.map(service => (
                  <div key={service.id} className="flex justify-between items-start p-4 rounded-2xl bg-white/50 border border-white/60">
                    <div>
                      <h3 className="font-medium text-[#2C2C2C]">{service.name}</h3>
                      {service.description && (
                        <p className="text-xs text-[#2C2C2C]/60 mt-1 max-w-sm">{service.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-semibold text-[#D4846A]">${service.price}</p>
                      <p className="text-xs text-[#2C2C2C]/50 mt-0.5">{service.durationMinutes} mins</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#2C2C2C]/50 italic">No services currently available.</p>
              )}
            </div>
          </div>

          {/* Business Hours Section */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8">
            <h2 className="text-2xl font-serif font-light text-[#2C2C2C] mb-6">Business Hours</h2>
            <div className="space-y-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                const config = (business.workingHours as any)?.[day];
                
                return (
                  <div key={day} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-[#2C2C2C]">{day}</span>
                    {config?.active ? (
                      <span className="text-[#2C2C2C]/70">
                        {(() => {
                          const [sh, sm] = config.start.split(':');
                          const [eh, em] = config.end.split(':');
                          const formatTime = (h: string, m: string) => {
                            const hr = parseInt(h);
                            const ampm = hr >= 12 ? 'PM' : 'AM';
                            const h12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
                            return `${h12}:${m} ${ampm}`;
                          };
                          return `${formatTime(sh, sm)} - ${formatTime(eh, em)}`;
                        })()}
                      </span>
                    ) : (
                      <span className="text-[#2C2C2C]/40 italic">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="pt-4">
              <h2 className="text-2xl font-serif font-light text-[#2C2C2C] mb-6 px-2">What Clients Say</h2>
              <Reviews3DStack reviews={reviews} />
            </div>
          )}

        </div>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/90 via-white/80 to-transparent backdrop-blur-sm z-50">
        <div className="container mx-auto max-w-3xl flex justify-center">
          <Link 
            href={`/book/${business.slug}`}
            className="w-full max-w-md bg-[#D4846A] hover:bg-[#c67a62] text-white text-center font-medium py-4 rounded-2xl shadow-xl shadow-[#D4846A]/20 transition-all transform hover:scale-[1.02]"
          >
            Book an Appointment
          </Link>
        </div>
      </div>

    </div>
  );
}
