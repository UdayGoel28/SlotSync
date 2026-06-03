"use client";

import { useState } from "react";
import { updateWorkingHours } from "@/app/actions/setup";

type DayConfig = {
  active: boolean;
  start: string;
  end: string;
};

type WorkingHours = Record<string, DayConfig>;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function BusinessHoursForm({ initialHours }: { initialHours: any }) {
  const [hours, setHours] = useState<WorkingHours>(initialHours || {});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (day: string) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day]?.active
      }
    }));
  };

  const handleChange = (day: string, field: "start" | "end", value: string) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await updateWorkingHours(hours);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#2C2C2C]">Business Hours</h2>
          <p className="text-sm text-[#2C2C2C]/50">Set the hours when you are available for bookings.</p>
        </div>
        <button
          disabled={loading}
          onClick={handleSave}
          className="bg-[#D4846A] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#c67a62] disabled:opacity-50 transition-all shadow-sm"
        >
          {loading ? "Saving..." : saved ? "Saved!" : "Save Hours"}
        </button>
      </div>

      <div className="space-y-3">
        {DAYS.map(day => {
          const config = hours[day] || { active: false, start: "09:00", end: "17:00" };
          
          return (
            <div key={day} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${config.active ? 'bg-white border-gray-200' : 'bg-gray-50/50 border-gray-100'}`}>
              <div className="flex items-center gap-4 min-w-[140px]">
                <button
                  type="button"
                  onClick={() => handleToggle(day)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${config.active ? 'bg-[#D4846A]' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${config.active ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm font-medium ${config.active ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/40'}`}>
                  {day}
                </span>
              </div>
              
              {config.active ? (
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={config.start}
                    onChange={(e) => handleChange(day, "start", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A] text-[#2C2C2C]"
                  />
                  <span className="text-[#2C2C2C]/40 text-sm">to</span>
                  <input
                    type="time"
                    value={config.end}
                    onChange={(e) => handleChange(day, "end", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A] text-[#2C2C2C]"
                  />
                </div>
              ) : (
                <div className="text-sm font-medium text-[#2C2C2C]/30 italic w-[180px] text-center">
                  Closed
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
