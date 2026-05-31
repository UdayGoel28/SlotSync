import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { StaffSelector } from "@/components/booking/StaffSelector";
import { DatePicker } from "@/components/booking/DatePicker";
import { TimePicker } from "@/components/booking/TimePicker";
import { ClientForm } from "@/components/booking/ClientForm";

interface BookingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = await params;

  // In production, fetch business data by slug from the API
  // const business = await fetch(`${process.env.API_URL}/api/businesses/slug/${slug}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="container mx-auto max-w-lg py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Book an Appointment</h1>
          <p className="text-muted-foreground mt-1">
            at <span className="font-medium text-foreground">{slug}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6 space-y-6">
          <ServiceSelector />
          <StaffSelector />
          <DatePicker />
          <TimePicker />
          <ClientForm />

          <button className="w-full rounded-lg bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
