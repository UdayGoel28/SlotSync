"use client";

import { format } from "date-fns";

interface DatePickerProps {
  date: Date | null;
  setDate: (d: Date | null) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const value = date ? format(date, "yyyy-MM-dd") : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const d = new Date(e.target.value);
      setDate(new Date(d.getTime() + d.getTimezoneOffset() * 60000));
    } else {
      setDate(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-[#2C2C2C]">Select Date</label>
      <input
        type="date"
        value={value}
        onChange={handleChange}
        min={format(new Date(), "yyyy-MM-dd")}
        className="w-full h-12 rounded-xl bg-white/50 border border-sage-200/50 px-4 text-[#2C2C2C] text-sm focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-coral-100 transition-all"
      />
    </div>
  );
}
