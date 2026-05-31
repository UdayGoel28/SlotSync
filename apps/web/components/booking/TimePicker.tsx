"use client";

export function TimePicker() {
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Time</label>
      <div className="grid grid-cols-4 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            type="button"
            className="rounded-lg border px-2 py-2 text-xs font-medium hover:border-brand-400 hover:bg-brand-50 transition-colors"
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
