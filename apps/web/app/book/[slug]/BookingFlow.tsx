"use client";

import { useState } from "react";
import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { StaffSelector } from "@/components/booking/StaffSelector";
import { DatePicker } from "@/components/booking/DatePicker";
import { TimePicker } from "@/components/booking/TimePicker";
import { StripeCheckoutWrapper } from "@/components/booking/StripeCheckoutForm";
import { createBookingIntent } from "@/app/actions/booking";
import { track } from "@/lib/posthog";

type BusinessData = {
  id: string;
  name: string;
  stripeAccountId: string | null;
  services: any[];
  staff: any[];
};

export function BookingFlow({ business }: { business: BusinessData }) {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string>("");
  const [date, setDate] = useState<Date | null>(new Date()); // Mocked default
  const [time, setTime] = useState<string>("09:00"); // Mocked default
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!serviceId || !clientName || !clientEmail) {
      setError("Please fill in all details and select a service.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const startTime = date ? new Date(date) : new Date();
      // Simple mock time setting
      const [hours, mins] = time.split(":");
      startTime.setHours(parseInt(hours), parseInt(mins), 0, 0);

      const res = await createBookingIntent({
        businessId: business.id,
        serviceId,
        clientName,
        clientEmail,
        clientPhone,
        startTime,
      });

      if (res.clientSecret) {
        setClientSecret(res.clientSecret);
        setStep(2);
      } else if (res.success) {
        const selectedService = business.services.find(s => s.id === serviceId);
        track({ 
          event: "booking_created", 
          properties: { 
            serviceName: selectedService?.name, 
            servicePrice: selectedService?.price, 
            businessSlug: business.id 
          } 
        });
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create booking intent");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
        <p className="text-muted-foreground">
          Thank you, {clientName}. Your appointment has been booked.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 space-y-6">
      {step === 1 ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Select Service</label>
            <select 
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="">-- Choose a service --</option>
              {business.services.filter(s => s.isActive).map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} - ${s.price} ({s.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium">Your Details</label>
            <input
              type="text"
              placeholder="Full name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="email"
              placeholder="Email address"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button 
            onClick={handleContinue}
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : (business.stripeAccountId ? "Continue to Payment" : "Confirm Booking")}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
          {clientSecret && (
            <StripeCheckoutWrapper 
              clientSecret={clientSecret} 
              onSuccess={() => {
                const selectedService = business.services.find(s => s.id === serviceId);
                track({ 
                  event: "booking_created", 
                  properties: { 
                    serviceName: selectedService?.name, 
                    servicePrice: selectedService?.price, 
                    businessSlug: business.id 
                  } 
                });
                setSuccess(true);
              }} 
            />
          )}
        </>
      )}
    </div>
  );
}
