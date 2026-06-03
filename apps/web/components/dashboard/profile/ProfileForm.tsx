"use client";

import { useState } from "react";
import { updateBusinessProfile } from "@/app/actions/setup";

type BusinessProfile = {
  name: string;
  category: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  googlePlaceId: string | null;
};

const CATEGORIES = [
  "Hair Salon",
  "Barbershop",
  "Nail Salon",
  "Spa & Massage",
  "Tattoo Studio",
  "Personal Training",
  "Medical Clinic",
  "Therapy & Counseling",
  "Consulting",
  "Other"
];

export function ProfileForm({ business }: { business: BusinessProfile }) {
  const [name, setName] = useState(business.name);
  const [category, setCategory] = useState(business.category || CATEGORIES[0]);
  const [description, setDescription] = useState(business.description || "");
  const [address, setAddress] = useState(business.address || "");
  const [phone, setPhone] = useState(business.phone || "");
  const [website, setWebsite] = useState(business.website || "");
  const [logoUrl, setLogoUrl] = useState(business.logoUrl || "");
  const [coverUrl, setCoverUrl] = useState(business.coverUrl || "");
  const [googlePlaceId, setGooglePlaceId] = useState(business.googlePlaceId || "");
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateBusinessProfile({
      name,
      category,
      description: description || undefined,
      address: address || undefined,
      phone: phone || undefined,
      website: website || undefined,
      logoUrl: logoUrl || undefined,
      coverUrl: coverUrl || undefined,
      googlePlaceId: googlePlaceId || undefined,
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
        <h2 className="text-lg font-semibold text-[#2C2C2C]">Business Identity</h2>
        <p className="text-sm text-[#2C2C2C]/50">This information will be displayed on your public profile.</p>
      </div>

      <div className="space-y-6 max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Business Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A] bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">About / Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A] resize-none"
            placeholder="Tell clients about your business..."
          />
          <p className="text-[10px] text-right text-gray-400 mt-1">{description.length}/500</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A]"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Website</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A]"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Physical Address</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A]"
            placeholder="123 Main St, City, State 12345"
          />
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold mb-4 text-[#2C2C2C]">Branding</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Logo URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A]"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Cover Image URL</label>
              <input
                type="url"
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A]"
                placeholder="https://example.com/cover.png"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold mb-2 text-[#2C2C2C]">Google Reviews</h3>
          <p className="text-xs text-[#2C2C2C]/50 mb-4">
            Find your Place ID at <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noreferrer" className="text-[#D4846A] hover:underline">developers.google.com</a> to display reviews on your public profile.
          </p>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#2C2C2C]">Google Place ID</label>
            <input
              type="text"
              value={googlePlaceId}
              onChange={e => setGooglePlaceId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4846A] focus:ring-1 focus:ring-[#D4846A]"
              placeholder="ChIJ..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            disabled={loading}
            onClick={handleSave}
            className="bg-[#D4846A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#c67a62] disabled:opacity-50 transition-all shadow-md shadow-[#D4846A]/20"
          >
            {loading ? "Saving..." : saved ? "Saved!" : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
