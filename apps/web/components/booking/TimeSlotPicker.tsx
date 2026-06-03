"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

export type TimeSlot = {
  start: string;
  end: string;
  startTime: string;
  endTime: string;
  display: string;
};

interface TimeSlotPickerProps {
  businessId: string;
  serviceId: string;
  date: Date;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export function TimeSlotPicker({
  businessId,
  serviceId,
  date,
  selectedSlot,
  onSelectSlot,
}: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setClosed(false);
    setSlots([]);

    const dateStr = format(date, "yyyy-MM-dd");
    fetch(`/api/booking/available-slots?businessId=${businessId}&serviceId=${serviceId}&date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
        setClosed(data.closed || false);
        setLoading(false);
      })
      .catch(() => {
        setSlots([]);
        setLoading(false);
      });
  }, [businessId, serviceId, date]);

  if (loading) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-[#2C2C2C]/60 mb-3">Loading available times…</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-white/30 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (closed) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-[#2C2C2C]/5 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>
        </div>
        <p className="text-sm font-medium text-[#2C2C2C]/60">Business is closed on this day</p>
        <p className="text-xs text-[#2C2C2C]/40 mt-1">Please select another date</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-[#2C2C2C]/5 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </div>
        <p className="text-sm font-medium text-[#2C2C2C]/60">No slots available on this date</p>
        <p className="text-xs text-[#2C2C2C]/40 mt-1">All time slots are booked. Try another date.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-[#2C2C2C]/60 mb-3">
        {slots.length} slot{slots.length !== 1 ? "s" : ""} available
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.start === slot.start;
          return (
            <button
              key={slot.start}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`
                px-4 py-3.5 rounded-2xl text-left transition-all duration-200 border
                ${isSelected
                  ? "bg-[#D4846A] text-white border-[#D4846A] shadow-lg shadow-[#D4846A]/20"
                  : "bg-white/50 border-white/60 text-[#2C2C2C] hover:bg-white/80 hover:border-[#D4846A]/30"
                }
              `}
            >
              <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-[#2C2C2C]"}`}>
                {slot.display}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
