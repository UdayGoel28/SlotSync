"use client";

interface TimePickerProps {
  time: string;
  setTime: (t: string) => void;
  availableSlots: string[];
}

export function TimePicker({ time, setTime, availableSlots }: TimePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-[#2C2C2C]">Select Time</label>
      {availableSlots.length === 0 ? (
        <p className="text-sm text-[#2C2C2C]/50 bg-white/50 p-4 rounded-xl border border-sage-200/50 text-center">
          No available slots for this date.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {availableSlots.map((slot) => {
            const [h, m] = slot.split(":");
            const hour = parseInt(h, 10);
            const displayTime = `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
            
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`rounded-xl border px-2 py-3 text-xs font-medium transition-all ${
                  time === slot
                    ? "bg-[#D4846A] text-white border-[#D4846A] shadow-lg shadow-coral-200/30"
                    : "bg-white/50 border-sage-200/50 text-[#2C2C2C] hover:border-[#D4846A] hover:bg-white"
                }`}
              >
                {displayTime}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}
