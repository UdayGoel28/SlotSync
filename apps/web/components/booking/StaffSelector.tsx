"use client";

export function StaffSelector() {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700">Select Staff (Optional)</label>
      <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800">
        <option value="">Any available staff member</option>
        <option value="alex">Alex (Master Stylist)</option>
        <option value="jordan">Jordan (Senior Barber)</option>
      </select>
    </div>
  );
}
