"use client";

import { useState } from "react";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { TimeSlotPicker, TimeSlot } from "@/components/booking/TimeSlotPicker";
import { StripeCheckoutWrapper } from "@/components/booking/StripeCheckoutForm";
import { createBookingIntent } from "@/app/actions/booking";
import { track } from "@/lib/posthog";
import { format } from "date-fns";

type BusinessData = {
  id: string;
  name: string;
  stripeAccountId: string | null;
  workingHours: any;
  bookingWindowDays: number;
  bufferMinutes: number;
  services: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
    description: string | null;
    isActive: boolean;
  }[];
  staff: any[];
};

const STEP_LABELS = ["Service", "Date", "Time", "Details", "Payment", "Confirmed"];

function StepIndicator({ currentStep, hasPayment }: { currentStep: number; hasPayment: boolean }) {
  const steps = hasPayment ? STEP_LABELS : STEP_LABELS.filter((_, i) => i !== 4);
  const displayStep = hasPayment ? currentStep : (currentStep > 4 ? currentStep - 1 : currentStep);

  return (
    <div className="flex items-center justify-center gap-1.5 mb-8">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === displayStep;
        const isDone = stepNum < displayStep;
        return (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className={`
                w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300
                ${isActive ? "bg-[#D4846A] text-white shadow-md shadow-[#D4846A]/30" : ""}
                ${isDone ? "bg-[#D4846A]/20 text-[#D4846A]" : ""}
                ${!isActive && !isDone ? "bg-[#2C2C2C]/5 text-[#2C2C2C]/30" : ""}
              `}
            >
              {isDone ? "✓" : stepNum}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 h-0.5 rounded transition-colors duration-300 ${isDone ? "bg-[#D4846A]/30" : "bg-[#2C2C2C]/5"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function BookingFlow({ business }: { business: BusinessData }) {
  // Steps: 1=Service, 2=Date, 3=Time, 4=Details, 5=Payment, 6=Confirmed
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedService = business.services.find((s) => s.id === serviceId);
  const hasPayment = !!business.stripeAccountId;

  const handleSubmitBooking = async () => {
    if (!serviceId || !selectedDate || !selectedSlot || !clientName || !clientEmail) {
      setError("Please complete all steps.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startTime = new Date(selectedSlot.startTime);

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
        setStep(5); // Go to payment
      } else if (res.success) {
        track({
          event: "booking_created",
          properties: {
            serviceName: selectedService?.name,
            servicePrice: selectedService?.price,
            businessSlug: business.id,
          },
        });
        setStep(6); // Skip to confirmed
      }
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && !serviceId) {
      setError("Please select a service.");
      return;
    }
    if (step === 2 && !selectedDate) {
      setError("Please select a date.");
      return;
    }
    if (step === 3 && !selectedSlot) {
      setError("Please select a time slot.");
      return;
    }
    if (step === 4) {
      if (!clientName.trim() || !clientEmail.trim()) {
        setError("Name and email are required.");
        return;
      }
      // Submit the booking
      handleSubmitBooking();
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) setStep(step - 1);
  };

  // When date changes, reset the time slot
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep(3);
  };

  // When service changes, reset date and time
  const handleServiceSelect = (id: string) => {
    setServiceId(id);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 sm:p-8">
      <StepIndicator currentStep={step} hasPayment={hasPayment} />

      {/* ─── Step 1: Select Service ─── */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-serif font-light text-[#2C2C2C] mb-1">Choose a Service</h2>
          <p className="text-xs text-[#2C2C2C]/50 mb-5">Select the service you'd like to book.</p>
          <div className="space-y-2">
            {business.services.filter((s) => s.isActive).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleServiceSelect(s.id)}
                className={`
                  w-full text-left rounded-2xl border p-4 transition-all duration-200
                  ${serviceId === s.id
                    ? "bg-[#D4846A]/10 border-[#D4846A]/40 shadow-sm"
                    : "bg-white/50 border-white/60 hover:bg-white/80"
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm font-medium ${serviceId === s.id ? "text-[#D4846A]" : "text-[#2C2C2C]"}`}>
                      {s.name}
                    </p>
                    {s.description && (
                      <p className="text-xs text-[#2C2C2C]/50 mt-1">{s.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className={`text-sm font-semibold ${serviceId === s.id ? "text-[#D4846A]" : "text-[#2C2C2C]"}`}>
                      ${s.price}
                    </p>
                    <p className="text-[10px] text-[#2C2C2C]/40 mt-0.5">{s.durationMinutes} mins</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Step 2: Pick Date ─── */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-serif font-light text-[#2C2C2C] mb-1">Pick a Date</h2>
          <p className="text-xs text-[#2C2C2C]/50 mb-5">
            {selectedService ? `${selectedService.name} · ${selectedService.durationMinutes} mins` : ""}
          </p>
          <BookingCalendar
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            workingHours={business.workingHours}
            bookingWindowDays={business.bookingWindowDays}
          />
        </div>
      )}

      {/* ─── Step 3: Pick Time ─── */}
      {step === 3 && selectedDate && (
        <div>
          <h2 className="text-xl font-serif font-light text-[#2C2C2C] mb-1">Pick a Time</h2>
          <p className="text-xs text-[#2C2C2C]/50 mb-5">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
            {selectedService ? ` · ${selectedService.name}` : ""}
          </p>
          <TimeSlotPicker
            businessId={business.id}
            serviceId={serviceId}
            date={selectedDate}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />
        </div>
      )}

      {/* ─── Step 4: Your Details ─── */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-serif font-light text-[#2C2C2C] mb-1">Your Details</h2>
          <p className="text-xs text-[#2C2C2C]/50 mb-5">We'll send your confirmation here.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#2C2C2C]/60 mb-1.5">Full name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full h-12 rounded-2xl bg-white/50 border border-white/60 px-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/25 focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-[#D4846A]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2C2C2C]/60 mb-1.5">Email address *</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="jane@email.com"
                className="w-full h-12 rounded-2xl bg-white/50 border border-white/60 px-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/25 focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-[#D4846A]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2C2C2C]/60 mb-1.5">Phone number</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-12 rounded-2xl bg-white/50 border border-white/60 px-4 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/25 focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-[#D4846A]/10 transition-all"
              />
            </div>
          </div>

          {/* Booking summary */}
          <div className="mt-6 p-4 rounded-2xl bg-[#2C2C2C]/[0.02] border border-[#2C2C2C]/5">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#2C2C2C]/30 mb-2">Booking Summary</p>
            <div className="space-y-1 text-sm text-[#2C2C2C]">
              <div className="flex justify-between">
                <span className="text-[#2C2C2C]/60">Service</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2C2C2C]/60">Date</span>
                <span className="font-medium">{selectedDate ? format(selectedDate, "MMM d, yyyy") : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2C2C2C]/60">Time</span>
                <span className="font-medium">{selectedSlot?.display}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2C2C2C]/5 mt-2">
                <span className="text-[#2C2C2C]/60">Total</span>
                <span className="font-semibold text-[#D4846A]">${selectedService?.price}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 5: Payment ─── */}
      {step === 5 && clientSecret && (
        <div>
          <h2 className="text-xl font-serif font-light text-[#2C2C2C] mb-1">Complete Payment</h2>
          <p className="text-xs text-[#2C2C2C]/50 mb-5">${selectedService?.price} for {selectedService?.name}</p>
          <StripeCheckoutWrapper
            clientSecret={clientSecret}
            onSuccess={() => {
              track({
                event: "booking_created",
                properties: {
                  serviceName: selectedService?.name,
                  servicePrice: selectedService?.price,
                  businessSlug: business.id,
                },
              });
              setStep(6);
            }}
          />
        </div>
      )}

      {/* ─── Step 6: Confirmation ─── */}
      {step === 6 && (
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl mb-6 shadow-lg shadow-emerald-100/50">
            ✓
          </div>
          <h2 className="text-2xl font-serif font-light text-[#2C2C2C] mb-2">Booking Confirmed!</h2>
          <p className="text-sm text-[#2C2C2C]/60 mb-8">
            Thank you, {clientName}. Your appointment has been booked.
          </p>

          <div className="p-5 rounded-2xl bg-white/60 border border-white/80 text-left max-w-sm mx-auto">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#2C2C2C]/50">Service</span>
                <span className="font-medium text-[#2C2C2C]">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2C2C2C]/50">Date</span>
                <span className="font-medium text-[#2C2C2C]">{selectedDate ? format(selectedDate, "EEEE, MMM d") : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2C2C2C]/50">Time</span>
                <span className="font-medium text-[#2C2C2C]">{selectedSlot?.display}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2C2C2C]/5">
                <span className="text-[#2C2C2C]/50">Total</span>
                <span className="font-semibold text-[#D4846A]">${selectedService?.price}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#2C2C2C]/40 mt-6">A confirmation email has been sent to {clientEmail}</p>
        </div>
      )}

      {/* ─── Error ─── */}
      {error && (
        <div className="mt-4 p-3 rounded-2xl bg-red-50/50 border border-red-100 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {/* ─── Navigation ─── */}
      {step < 5 && (
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 h-12 rounded-2xl border border-[#2C2C2C]/10 text-sm font-medium text-[#2C2C2C]/60 hover:bg-white/80 transition-all"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className={`
              ${step > 1 ? "flex-1" : "w-full"} h-12 rounded-2xl text-sm font-medium transition-all duration-200 disabled:opacity-50
              bg-[#D4846A] text-white hover:bg-[#c67a62] shadow-lg shadow-[#D4846A]/20
            `}
          >
            {loading
              ? "Processing…"
              : step === 4
                ? hasPayment
                  ? "Continue to Payment"
                  : "Confirm Booking"
                : "Next"
            }
          </button>
        </div>
      )}
    </div>
  );
}
