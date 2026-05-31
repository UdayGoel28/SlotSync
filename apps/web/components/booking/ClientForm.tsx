"use client";

export function ClientForm() {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Your Details</label>
      <input
        type="text"
        placeholder="Full name"
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <input
        type="email"
        placeholder="Email address"
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <input
        type="tel"
        placeholder="Phone number"
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}
