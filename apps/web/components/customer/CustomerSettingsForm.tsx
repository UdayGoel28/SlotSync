"use client";

import { useState } from "react";
import { updateCustomerInfo } from "@/app/actions/clients";
import { useRouter } from "next/navigation";

interface CustomerSettingsFormProps {
  email: string;
  initialName: string;
  initialPhone: string;
}

export function CustomerSettingsForm({ email, initialName, initialPhone }: CustomerSettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await updateCustomerInfo(email, { name, phone });
    
    if (res.success) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-serif font-light text-[#2C2C2C]">Contact Details</h2>
        <p className="text-sm text-[#2C2C2C]/50 mt-1">
          Update the information businesses use to contact you.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A] bg-white/70 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Phone Number</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A] bg-white/70 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Email Address</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50/50 text-[#2C2C2C]/50 cursor-not-allowed"
          />
          <p className="text-[10px] text-gray-400 mt-1.5">Email cannot be changed.</p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#D4846A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#c67a62] disabled:opacity-50 transition-all shadow-md shadow-[#D4846A]/20"
          >
            {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
