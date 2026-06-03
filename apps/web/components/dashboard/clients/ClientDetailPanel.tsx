"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ClientData } from "./ClientsTable";
import { getClientNote, saveClientNote } from "@/app/actions/clients";

interface ClientDetailPanelProps {
  client: ClientData;
  onClose: () => void;
}

export function ClientDetailPanel({ client, onClose }: ClientDetailPanelProps) {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getClientNote(client.email).then((res) => {
      setNotes(res.notes || "");
      setIsLoading(false);
    });
  }, [client.email]);

  const handleSaveNote = async () => {
    setIsSaving(true);
    await saveClientNote(client.email, notes);
    setIsSaving(false);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform border-l border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-[#2C2C2C]">Client Profile</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile Overview */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4846A]/20 to-[#D4846A]/5 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-[#D4846A]">{getInitials(client.name)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C2C2C]">{client.name}</h3>
                <p className="text-sm text-[#2C2C2C]/60 mt-0.5">{client.email}</p>
                <p className="text-sm text-[#2C2C2C]/60 mt-0.5">{client.phone || "No phone provided"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Spent</p>
                <p className="text-xl font-bold text-emerald-700">${client.totalSpend.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Bookings</p>
                <p className="text-xl font-bold text-[#2C2C2C]">{client.bookingCount}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Member since {format(new Date(client.firstBookingDate), "MMM d, yyyy")}
            </p>
          </div>

          {/* Private Notes */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[#2C2C2C]">Private Notes</h4>
              <button 
                onClick={handleSaveNote}
                disabled={isSaving || isLoading}
                className="text-xs font-medium text-[#D4846A] hover:text-[#c67a62] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
            {isLoading ? (
              <div className="w-full h-24 bg-gray-50 rounded-xl animate-pulse" />
            ) : (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private notes about this client..."
                className="w-full h-24 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-[#2C2C2C] placeholder:text-gray-400 focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A] resize-none"
              />
            )}
          </div>

          {/* Booking History */}
          <div className="p-6">
            <h4 className="text-sm font-semibold text-[#2C2C2C] mb-4">Booking History</h4>
            <div className="space-y-3">
              {client.bookings.map((booking) => (
                <div key={booking.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-[#2C2C2C]">{booking.serviceName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {format(new Date(booking.startTime), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#2C2C2C]">
                      ${booking.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider
                      ${booking.status === 'confirmed' || booking.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 
                        booking.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                        'bg-gray-100 text-gray-500'}
                    `}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
