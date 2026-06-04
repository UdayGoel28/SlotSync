"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

type BookingWithService = {
  id: string;
  clientName: string;
  startTime: Date;
  endTime: Date;
  status: string;
  service: {
    name: string;
    price: number;
  };
};

interface CalendarClientProps {
  bookings: BookingWithService[];
}

export function CalendarClient({ bookings }: CalendarClientProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get bookings for the currently selected date
  const selectedDateBookings = bookings
    .filter((b) => isSameDay(new Date(b.startTime), selectedDate))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Helper to check if a day has any bookings
  const getBookingsCountForDay = (day: Date) => {
    return bookings.filter((b) => isSameDay(new Date(b.startTime), day)).length;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* ─── Left Side: Calendar Grid ─── */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            &larr;
          </button>
          <h2 className="text-xl font-display font-medium text-[#2C2C2C]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            &rarr;
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const count = getBookingsCountForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  setSelectedDate(day);
                  if (!isCurrentMonth) {
                    setCurrentMonth(day);
                  }
                }}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-2xl text-sm transition-all relative overflow-hidden",
                  !isCurrentMonth && "text-gray-300",
                  isCurrentMonth && "text-gray-700 hover:bg-gray-50",
                  isSelected && "bg-[#D4846A] text-white hover:bg-[#D4846A] shadow-md shadow-[#D4846A]/20",
                  isToday(day) && !isSelected && "bg-sage-50 text-sage-600 font-semibold border border-sage-200"
                )}
              >
                <span className={cn("z-10", isSelected && "font-semibold")}>
                  {format(day, "d")}
                </span>
                
                {/* Dots indicator for bookings */}
                {count > 0 && (
                  <div className="flex gap-0.5 mt-1 z-10">
                    {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-1 h-1 rounded-full",
                          isSelected ? "bg-white" : "bg-[#D4846A]"
                        )}
                      />
                    ))}
                    {count > 3 && (
                      <div className={cn(
                        "w-1 h-1 rounded-full",
                        isSelected ? "bg-white" : "bg-[#D4846A]"
                      )} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Right Side: Daily Agenda ─── */}
      <div className="bg-[#FAF9F7] rounded-3xl p-6 sm:p-8 flex flex-col h-full min-h-[500px]">
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE")}
          </p>
          <h3 className="text-2xl font-display font-light text-[#2C2C2C]">
            {format(selectedDate, "MMM d, yyyy")}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {selectedDateBookings.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 pt-10">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                <span className="text-xl">☕</span>
              </div>
              <p className="text-[#2C2C2C]/50 text-sm">No appointments scheduled for this day.</p>
            </div>
          ) : (
            selectedDateBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4846A]" />
                
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-[#2C2C2C] text-sm">
                    {format(new Date(booking.startTime), "h:mm a")} 
                    <span className="text-gray-400 font-normal mx-1">-</span>
                    <span className="text-gray-500 font-normal text-xs">{format(new Date(booking.endTime), "h:mm a")}</span>
                  </p>
                  <span className={cn(
                    "text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                    booking.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  )}>
                    {booking.status}
                  </span>
                </div>

                <h4 className="font-semibold text-[#2C2C2C] mb-0.5">{booking.clientName}</h4>
                <p className="text-xs text-gray-500 mb-3">{booking.service.name}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <p className="text-xs font-medium text-[#D4846A]">${booking.service.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
