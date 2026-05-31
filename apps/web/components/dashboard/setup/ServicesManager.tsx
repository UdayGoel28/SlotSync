"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { addService, updateService, deleteService } from "@/app/actions/setup";

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description: string | null;
  isActive: boolean;
};

export function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setName("");
    setDuration(30);
    setPrice(0);
    setDescription("");
    setIsAdding(false);
    setIsEditing(null);
  };

  const startEdit = (s: Service) => {
    setName(s.name);
    setDuration(s.durationMinutes);
    setPrice(s.price);
    setDescription(s.description || "");
    setIsEditing(s.id);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!name) return;
    setLoading(true);

    if (isEditing) {
      const res = await updateService(isEditing, { name, durationMinutes: duration, price, description, isActive: true });
      if (res.success) {
        setServices(services.map(s => s.id === isEditing ? { ...s, name, durationMinutes: duration, price, description } : s));
      }
    } else {
      const res = await addService({ name, durationMinutes: duration, price, description });
      if (res.success) {
        // Optimistic refresh, actual refresh handled by server action revalidatePath
        window.location.reload(); 
      }
    }

    setLoading(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);
    const res = await deleteService(id);
    if (res.success) {
      setServices(services.filter(s => s.id !== id));
    }
    setLoading(false);
  };

  const toggleActive = async (s: Service) => {
    setLoading(true);
    const res = await updateService(s.id, { 
      name: s.name, 
      durationMinutes: s.durationMinutes, 
      price: s.price, 
      description: s.description || undefined, 
      isActive: !s.isActive 
    });
    if (res.success) {
      setServices(services.map(x => x.id === s.id ? { ...x, isActive: !x.isActive } : x));
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Services</h2>
          <p className="text-sm text-muted-foreground">Manage what clients can book.</p>
        </div>
        {!isAdding && !isEditing && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        )}
      </div>

      {(isAdding || isEditing) && (
        <div className="p-6 bg-slate-50 border-b">
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1.5">Service Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. Men's Haircut" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Price ($)</label>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Duration (mins)</label>
                <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description (optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
            </div>
            <div className="flex gap-2">
              <button disabled={loading} onClick={handleSave} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
                {loading ? "Saving..." : "Save Service"}
              </button>
              <button disabled={loading} onClick={resetForm} className="bg-white border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y">
        {services.length === 0 && !isAdding && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No services added yet. Add one to get started.
          </div>
        )}
        {services.map(s => (
          <div key={s.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
            <div>
              <h3 className={`font-medium ${!s.isActive && 'text-muted-foreground line-through'}`}>{s.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">${s.price} • {s.durationMinutes} mins</p>
              {s.description && <p className="text-xs text-slate-500 mt-1">{s.description}</p>}
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
