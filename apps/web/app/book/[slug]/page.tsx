import { notFound } from "next/navigation";
import { prisma } from "@slotsync/database";
import { BookingFlow } from "./BookingFlow";

interface BookingPageProps {
  params: Promise<{ slug: string }>;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="container mx-auto max-w-lg py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Book an Appointment</h1>
          <p className="text-muted-foreground mt-1">
            at <span className="font-medium text-foreground">{business.name}</span>
          </p>
        </div>

        <BookingFlow business={business} />
      </div>
    </div>
  );
}
