"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { addStaff, updateStaff, deleteStaff } from "@/app/actions/setup";

type Staff = {
  id: string;
  name: string;
  isActive: boolean;
  workingHours: any;
};

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function StaffManager({ initialStaff }: { initialStaff: Staff[] }) {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [workingHours, setWorkingHours] = useState<any>({});

  const resetForm = () => {
    setName("");
    setWorkingHours({});
    setIsAdding(false);
    setIsEditing(null);
  };

  const startEdit = (s: Staff) => {
    setName(s.name);
    setWorkingHours(s.workingHours || {});
    setIsEditing(s.id);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!name) return;
    setLoading(true);

    if (isEditing) {
      const res = await updateStaff(isEditing, { name, isActive: true, workingHours });
      if (res.success) {
        setStaffList(staffList.map(s => s.id === isEditing ? { ...s, name, workingHours } : s));
      }
    } else {
      const res = await addStaff({ name });
      if (res.success) {
        window.location.reload(); 
      }
    }

    setLoading(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    setLoading(true);
    const res = await deleteStaff(id);
    if (res.success) {
      setStaffList(staffList.filter(s => s.id !== id));
    }
    setLoading(false);
  };

  const toggleActive = async (s: Staff) => {
    setLoading(true);
    const res = await updateStaff(s.id, { 
      name: s.name, 
      workingHours: s.workingHours,
      isActive: !s.isActive 
    });
    if (res.success) {
      setStaffList(staffList.map(x => x.id === s.id ? { ...x, isActive: !x.isActive } : x));
    }
    setLoading(false);
  };

  const toggleDay = (day: string) => {
    setWorkingHours((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day]?.isOpen,
        open: prev[day]?.open || "09:00",
        close: prev[day]?.close || "17:00"
      }
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Staff</h2>
          <p className="text-sm text-muted-foreground">Manage your team members and their hours.</p>
        </div>
        {!isAdding && !isEditing && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        )}
      </div>

      {(isAdding || isEditing) && (
        <div className="p-6 bg-slate-50 border-b">
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1.5">Staff Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. Alex Johnson" />
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Working Days</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DAYS.map(day => (
                    <label key={day} className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={workingHours[day]?.isOpen || false} 
                        onChange={() => toggleDay(day)}
                      />
                      <span className="capitalize">{day}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Time configuration can be added later.</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button disabled={loading} onClick={handleSave} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
                {loading ? "Saving..." : "Save Staff"}
              </button>
              <button disabled={loading} onClick={resetForm} className="bg-white border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y">
        {staffList.length === 0 && !isAdding && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No staff added yet. Add one to get started.
          </div>
        )}
        {staffList.map(s => (
          <div key={s.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
            <div>
              <h3 className={`font-medium ${!s.isActive && 'text-muted-foreground line-through'}`}>{s.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleActive(s)}
                disabled={loading}
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
              >
                {s.isActive ? 'Active' : 'Inactive'}
              </button>
              <button onClick={() => startEdit(s)} disabled={loading} className="p-2 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(s.id)} disabled={loading} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
