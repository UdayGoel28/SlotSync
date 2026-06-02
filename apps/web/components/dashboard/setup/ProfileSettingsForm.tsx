"use client";

import { useState } from "react";
import { updateBusinessProfile } from "@/app/actions/setup";

type BusinessProfile = {
  name: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
};

export function ProfileSettingsForm({ business }: { business: BusinessProfile }) {
  const [name, setName] = useState(business.name);
  const [description, setDescription] = useState(business.description || "");
  const [logoUrl, setLogoUrl] = useState(business.logoUrl || "");
  const [coverUrl, setCoverUrl] = useState(business.coverUrl || "");
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateBusinessProfile({
      name,
      description: description || undefined,
      logoUrl: logoUrl || undefined,
      coverUrl: coverUrl || undefined,
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
        <h2 className="text-lg font-semibold">Public Profile</h2>
        <p className="text-sm text-muted-foreground">Customize how your business appears to clients.</p>
      </div>

      <div className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-medium mb-1.5">Business Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description (Bio)</label>
          <p className="text-xs text-muted-foreground mb-2">Tell clients what makes your services special.</p>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="We are a luxury salon specializing in..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Logo URL</label>
          <input
            type="url"
            value={logoUrl}
            onChange={e => setLogoUrl(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Cover Image URL</label>
          <input
            type="url"
            value={coverUrl}
            onChange={e => setCoverUrl(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="https://example.com/cover.png"
          />
        </div>

        <div className="pt-2">
          <button
            disabled={loading}
            onClick={handleSave}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : saved ? "Saved!" : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
