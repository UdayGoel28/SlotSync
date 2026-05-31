"use client";

export function DatePicker() {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Date</label>
      <input
        type="date"
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}
