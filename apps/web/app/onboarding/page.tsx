"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";

const steps = ["Business Info", "Services", "Working Hours", "Review"];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold mt-4">Set up your business</h1>
          <p className="text-muted-foreground mt-1">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= currentStep ? "bg-brand-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-8">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Business Name</label>
                <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="e.g., Elite Hair Studio" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select className="w-full rounded-lg border px-3 py-2 text-sm">
                  <option value="">Select a category</option>
                  <option>Hair Salon</option>
                  <option>Barber Shop</option>
                  <option>Spa & Wellness</option>
                  <option>Fitness & Training</option>
                  <option>Medical & Dental</option>
                  <option>Beauty & Aesthetics</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Country</label>
                <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="United States" />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Add your first service. You can add more later.</p>
              <div>
                <label className="block text-sm font-medium mb-1.5">Service Name</label>
                <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="e.g., Haircut" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Duration (minutes)</label>
                  <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="30" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Price ($)</label>
                  <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="50" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Set your regular working hours.</p>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <label className="w-24 text-sm font-medium">{day}</label>
                  <input type="time" defaultValue="09:00" className="rounded-lg border px-3 py-1.5 text-sm" />
                  <span className="text-muted-foreground">to</span>
                  <input type="time" defaultValue="17:00" className="rounded-lg border px-3 py-1.5 text-sm" />
                </div>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold">You&apos;re all set!</h3>
              <p className="text-muted-foreground">
                Your booking page is ready. Share it with your clients to start accepting appointments.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className={`text-sm font-medium ${currentStep === 0 ? "invisible" : ""}`}
            >
              Back
            </button>
            <button
              onClick={() =>
                currentStep < steps.length - 1
                  ? setCurrentStep(currentStep + 1)
                  : handleComplete()
              }
              className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              {currentStep === steps.length - 1 ? "Go to Dashboard" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
