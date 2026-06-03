"use client";

import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  format,
} from "date-fns";

interface BookingCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  workingHours: Record<string, any>;
  bookingWindowDays: number;
}

const DAYS_HEADER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function BookingCalendar({
  selectedDate,
  onSelectDate,
  workingHours,
  bookingWindowDays,
}: BookingCalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => addDays(today, bookingWindowDays), [today, bookingWindowDays]);
  const [currentMonth, setCurrentMonth] = useState(today);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  // Build array of days to render
  const days: Date[] = [];
  let cursor = calStart;
  while (cursor <= calEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  const canGoPrev = isAfter(monthStart, today);
  const canGoNext = isBefore(endOfMonth(currentMonth), maxDate);

  const handlePrev = () => {
    if (canGoPrev) setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleNext = () => {
    if (canGoNext) setCurrentMonth(addMonths(currentMonth, 1));
  };

  const isDayDisabled = (day: Date): boolean => {
    // Past
    if (isBefore(day, today)) return true;
    // Beyond booking window
    if (isAfter(day, maxDate)) return true;
    // Not in current month view
    if (!isSameMonth(day, currentMonth)) return true;
    // Business closed on this day of week
    const dayName = DAY_NAMES[day.getDay()];
    const config = workingHours?.[dayName];
    if (!config || !config.active) return true;
    return false;
  };

  return (
    <div className="w-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoPrev}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#2C2C2C]/60 hover:bg-white/80 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h3 className="text-base font-serif font-light text-[#2C2C2C] tracking-wide">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#2C2C2C]/60 hover:bg-white/80 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_HEADER.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium tracking-wider uppercase text-[#2C2C2C]/40 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const disabled = isDayDisabled(day);
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelectDate(day)}
              className={`
                relative w-full aspect-square rounded-xl text-sm font-medium transition-all duration-200
                flex items-center justify-center
                ${!inMonth ? "invisible" : ""}
                ${disabled && inMonth ? "text-[#2C2C2C]/15 cursor-not-allowed" : ""}
                ${!disabled && !isSelected ? "text-[#2C2C2C] hover:bg-[#D4846A]/10 cursor-pointer" : ""}
                ${isSelected ? "bg-[#D4846A] text-white shadow-lg shadow-[#D4846A]/25" : ""}
                ${isToday && !isSelected ? "ring-2 ring-[#D4846A]/40 ring-inset" : ""}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
