"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

export function BookingLinkHeader({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  
  // Try to use window location, fallback to NEXT_PUBLIC_APP_URL, then localhost
  const baseUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
  const link = `${baseUrl}/book/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 className="font-semibold text-brand-900">Your Public Booking Page</h2>
        <p className="text-sm text-brand-600 mt-1">Share this link with your clients so they can book appointments.</p>
      </div>
      <div className="flex items-center gap-2 bg-white border rounded-lg p-1.5 w-full md:w-auto">
        <div className="px-3 py-1.5 text-sm text-slate-600 truncate max-w-[200px] md:max-w-xs">
          {link}
        </div>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-slate-100 rounded-md transition-colors shrink-0"
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
        </button>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="p-2 hover:bg-slate-100 rounded-md transition-colors shrink-0"
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>
      </div>
    </div>
  );
}
