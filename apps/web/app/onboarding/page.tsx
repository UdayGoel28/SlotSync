"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { completeOnboarding } from "@/app/actions/onboarding";

const steps = ["Business Info", "Services", "Working Hours", "Review"];

const defaultHours = {
  Monday: { start: "09:00", end: "17:00", active: true },
  Tuesday: { start: "09:00", end: "17:00", active: true },
  Wednesday: { start: "09:00", end: "17:00", active: true },
  Thursday: { start: "09:00", end: "17:00", active: true },
  Friday: { start: "09:00", end: "17:00", active: true },
  Saturday: { start: "09:00", end: "17:00", active: false },
  Sunday: { start: "09:00", end: "17:00", active: false },
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  // Form State
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [workingHours, setWorkingHours] = useState(defaultHours);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleWorkingHoursChange = (day: string, field: string, value: any) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError("");

    const result = await completeOnboarding({
      businessName,
      category,
      country,
      workingHours,
    });

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/dashboard");
    }
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
          {error && (
            <div className="mb-6 p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Business Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm" 
                  placeholder="e.g., Elite Hair Studio" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Hair Salon">Hair Salon</option>
                  <option value="Barber Shop">Barber Shop</option>
                  <option value="Spa & Wellness">Spa & Wellness</option>
                  <option value="Fitness & Training">Fitness & Training</option>
                  <option value="Medical & Dental">Medical & Dental</option>
                  <option value="Beauty & Aesthetics">Beauty & Aesthetics</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Country</label>
                <input 
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm" 
                  placeholder="United States" 
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">You can add services later from the dashboard.</p>
              <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-center text-sm text-muted-foreground">
                Services will be configured in Step 4 of the roadmap.
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Set your regular working hours.</p>
              {Object.keys(workingHours).map((day) => {
                const hours = workingHours[day as keyof typeof workingHours];
                return (
                  <div key={day} className="flex items-center gap-4">
                    <label className="w-24 text-sm font-medium flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={hours.active} 
                        onChange={(e) => handleWorkingHoursChange(day, "active", e.target.checked)}
                      />
                      {day}
                    </label>
                    <input 
                      type="time" 
                      value={hours.start}
                      onChange={(e) => handleWorkingHoursChange(day, "start", e.target.value)}
                      disabled={!hours.active}
                      className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50" 
                    />
                    <span className="text-muted-foreground">to</span>
                    <input 
                      type="time" 
                      value={hours.end}
                      onChange={(e) => handleWorkingHoursChange(day, "end", e.target.value)}
                      disabled={!hours.active}
                      className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50" 
                    />
                  </div>
                );
              })}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold">You&apos;re all set!</h3>
              <p className="text-muted-foreground">
                Your business profile is ready to be created. Click complete to go to your dashboard.
              </p>
              
              <div className="text-left mt-6 bg-slate-50 p-4 rounded-lg border text-sm space-y-2">
                <p><strong>Business:</strong> {businessName || "Not set"}</p>
                <p><strong>Category:</strong> {category || "Not set"}</p>
                <p><strong>Country:</strong> {country || "Not set"}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={isSubmitting}
              className={`text-sm font-medium ${currentStep === 0 ? "invisible" : ""}`}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  // Basic validation for step 0
                  if (currentStep === 0 && (!businessName || !category || !country)) {
                    setError("Please fill out all fields");
                    return;
                  }
                  setError("");
                  setCurrentStep(currentStep + 1);
                } else {
                  handleComplete();
                }
              }}
              disabled={isSubmitting}
              className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {currentStep === steps.length - 1 
                ? (isSubmitting ? "Saving..." : "Complete Setup") 
                : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
