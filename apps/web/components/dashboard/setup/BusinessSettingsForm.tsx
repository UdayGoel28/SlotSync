"use client";

import { useState } from "react";
import { updateBusinessSettings } from "@/app/actions/setup";

type Business = {
  bufferMinutes: number;
  bookingWindowDays: number;
  cancellationHours: number;
};

export function BusinessSettingsForm({ business }: { business: Business }) {
  const [buffer, setBuffer] = useState(business.bufferMinutes);
  const [windowDays, setWindowDays] = useState(business.bookingWindowDays);
  const [cancelHours, setCancelHours] = useState(business.cancellationHours);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateBusinessSettings({
      bufferMinutes: buffer,
      bookingWindowDays: windowDays,
      cancellationHours: cancelHours
    });

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Booking Rules</h2>
        <p className="text-sm text-muted-foreground">Configure how and when clients can book you.</p>
      </div>

      <div className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-medium mb-1.5">Buffer Time Between Appointments</label>
          <p className="text-xs text-muted-foreground mb-2">Give yourself time to clean up or take a break before the next client.</p>
          <select
            value={buffer}
            onChange={e => setBuffer(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value={0}>No buffer (0 mins)</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Booking Window</label>
          <p className="text-xs text-muted-foreground mb-2">How far in advance can clients book an appointment?</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="365"
              value={windowDays}
              onChange={e => setWindowDays(Number(e.target.value))}
              className="w-24 border rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-sm">days into the future</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Cancellation Policy</label>
          <p className="text-xs text-muted-foreground mb-2">Minimum notice required for a client to cancel or reschedule.</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              value={cancelHours}
              onChange={e => setCancelHours(Number(e.target.value))}
              className="w-24 border rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-sm">hours before appointment</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            disabled={loading}
            onClick={handleSave}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
