"use client";

import { useState } from "react";
import { updateReviewSettings } from "@/app/actions/setup";
import {
  Star,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  Mail,
  ToggleLeft,
  ToggleRight,
  Info,
  TrendingUp,
} from "lucide-react";

type Props = {
  googlePlaceId: string | null;
  reviewsEnabled: boolean;
  businessName: string;
  reviewsSentThisMonth: number;
};

export function ReviewsSettingsClient({
  googlePlaceId: initialPlaceId,
  reviewsEnabled: initialEnabled,
  businessName,
  reviewsSentThisMonth,
}: Props) {
  const [placeId, setPlaceId] = useState(initialPlaceId ?? "");
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reviewLink = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const res = await updateReviewSettings({
      googlePlaceId: placeId.trim() || null,
      reviewsEnabled: enabled,
    });
    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError(res.error ?? "Failed to save");
    }
  };

  const handleCopy = async () => {
    if (!reviewLink) return;
    await navigator.clipboard.writeText(reviewLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Stats card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2C2C2C]">{reviewsSentThisMonth}</p>
            <p className="text-sm text-muted-foreground">Requests sent this month</p>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2C2C2C]">
              {placeId ? "Connected" : "Not set"}
            </p>
            <p className="text-sm text-muted-foreground">Google Business status</p>
          </div>
        </div>
      </div>

      {/* Settings card */}
      <div className="bg-white border rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-[#2C2C2C]">Google Business Setup</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Connect your Google Business Profile to automatically collect reviews.
          </p>
        </div>

        {/* Place ID input */}
        <div>
          <label htmlFor="placeId" className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
            Google Place ID
          </label>
          <input
            id="placeId"
            type="text"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4846A]/30 focus:border-[#D4846A] transition-all"
          />
          <div className="flex items-start gap-1.5 mt-2">
            <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Find your Place ID at{" "}
              <a
                href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4846A] hover:underline inline-flex items-center gap-0.5"
              >
                developers.google.com/maps
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        {/* Review link preview */}
        {reviewLink && (
          <div className="bg-[#FAF9F7] border border-dashed border-sage-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Your Review Link
            </p>
            <div className="flex items-center gap-2">
              <code className="text-xs text-[#2C2C2C] flex-1 break-all leading-relaxed">
                {reviewLink}
              </code>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg hover:bg-white transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <a
                  href={reviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg hover:bg-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Test
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Auto-send toggle */}
        <div className="flex items-center justify-between py-3 border-t">
          <div>
            <p className="text-sm font-medium text-[#2C2C2C]">Auto-send review requests</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatically send review requests 1 hour after each appointment ends
            </p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className="ml-4 shrink-0 transition-colors"
            aria-label={enabled ? "Disable auto-send" : "Enable auto-send"}
          >
            {enabled ? (
              <ToggleRight className="w-10 h-10 text-[#D4846A]" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-gray-300" />
            )}
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#D4846A] hover:bg-[#C07558] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 hover:shadow-md"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>

      {/* Message previews */}
      {placeId && (
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-[#2C2C2C]">Message Previews</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              This is what your clients will receive after their appointment.
            </p>
          </div>

          {/* SMS preview */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#D4846A]" />
              <span className="text-sm font-medium text-[#2C2C2C]">SMS</span>
            </div>
            <div className="bg-[#FAF9F7] rounded-xl p-4 border">
              <div className="inline-block bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs">
                <p className="text-sm text-[#2C2C2C] leading-relaxed">
                  Thanks for visiting <strong>{businessName}</strong>! Mind leaving us a quick review? It means a lot 🙏
                  <br />
                  <span className="text-blue-600 break-all">
                    https://search.google.com/local/writereview?placeid={placeId}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Email preview */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D4846A]" />
              <span className="text-sm font-medium text-[#2C2C2C]">Email</span>
            </div>
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 border-b px-4 py-2.5 flex items-center gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10">From</span>
                    <span className="text-xs text-[#2C2C2C]">{businessName} via SlotSync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10">Subject</span>
                    <span className="text-xs text-[#2C2C2C] font-medium">
                      How was your visit to {businessName}? ⭐
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-[#2C2C2C] font-medium">How was your visit?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hi [Client Name], we hope you had a great experience at {businessName}! Your feedback helps other clients find us. It only takes 30 seconds 🙏
                </p>
                <div>
                  <a
                    href={reviewLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#D4846A] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#C07558] transition-colors"
                  >
                    Leave a Google Review ⭐
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          How it works
        </h3>
        <ol className="space-y-2">
          {[
            "Client completes their appointment",
            "SlotSync waits 1 hour after the appointment ends",
            "A personalized SMS + email is sent with your Google review link",
            "Client leaves a review — you build your reputation automatically",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-amber-800">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
