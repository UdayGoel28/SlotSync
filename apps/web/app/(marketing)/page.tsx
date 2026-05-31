"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { joinWaitlist } from "@/app/actions";

// Icons for How It Works
const Step1Icon = () => (
  <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const Step2Icon = () => (
  <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

const Step3Icon = () => (
  <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.12c-.783-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
  </svg>
);

// Features Icons
const AppFreeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const FlatPriceIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const StripeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ReviewIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const RemindersIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SyncIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SupportIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default function MarketingLandingPage() {
  const [formData, setFormData] = useState({ email: "", businessType: "", country: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const res = await joinWaitlist(formData);
    setIsSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setFormData({ email: "", businessType: "", country: "" });
    } else {
      setError(res.error || "Something went wrong. Please try again.");
    }
  };

  const scrollToWaitlist = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const waitlistSection = document.getElementById("waitlist");
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSwitch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const switchSection = document.getElementById("switching");
    if (switchSection) {
      switchSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      
      {/* 1. TOP BANNER */}
      <div className="w-full bg-amber-500 py-3 px-4 text-slate-950 text-center text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-3 border-b border-amber-600 shadow-sm z-40 relative">
        <span>Switching from Booksy? Get 3 months free.</span>
        <a 
          href="#switching" 
          onClick={scrollToSwitch}
          className="bg-slate-900 text-white text-xs px-3 py-1 rounded-full font-medium hover:bg-slate-800 hover:shadow-md transition-all active:scale-95"
        >
          Claim Offer
        </a>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white pt-20 pb-28 px-4 overflow-hidden border-b border-slate-800">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-slate-900 to-slate-950 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 font-medium px-4 py-1.5 rounded-full text-xs border border-amber-500/30">
              ⚡ Booksy Alternative
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none font-display text-white max-w-2xl mx-auto lg:mx-0">
              Your clients book in <span className="text-amber-500">seconds</span>. No app download. Ever.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium">
              Flat pricing. Zero commission. Google Reviews built-in.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={scrollToWaitlist}
                className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
              >
                Start Free — No Credit Card Needed
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Targeting service businesses globally — including US, UK, Canada, and Australia.
            </p>
          </div>

          {/* Hero Right - Mobile Booking Page Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[340px] bg-slate-900 border-[8px] border-slate-700 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/18]"
            >
              {/* Device Notch */}
              <div className="absolute top-0 inset-x-0 flex justify-center z-20">
                <div className="bg-slate-700 h-5 w-40 rounded-b-2xl" />
              </div>

              {/* Mockup Booking App UI */}
              <div className="h-full bg-slate-950 text-slate-200 overflow-y-auto p-4 pt-8 space-y-4 text-left text-xs font-sans">
                {/* Header */}
                <div className="text-center pt-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 font-bold text-amber-500 text-sm">
                    B
                  </div>
                  <h3 className="font-bold text-sm tracking-tight text-white font-display">Barber & Co</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-amber-500">★★★★★</span>
                    <span className="text-[10px] text-slate-400">(120 Google Reviews)</span>
                  </div>
                </div>

                {/* Service Selector */}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">1. Select Service</span>
                  <div className="space-y-1.5">
                    <div className="bg-slate-900 border border-amber-500 rounded-xl p-2.5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white text-[11px]">Classic Haircut</p>
                        <p className="text-[9px] text-slate-400">30 min • Standard Cut</p>
                      </div>
                      <span className="font-bold text-amber-500 text-[11px]">$35.00</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center opacity-60">
                      <div>
                        <p className="font-bold text-white text-[11px]">Beard Trim</p>
                        <p className="text-[9px] text-slate-400">15 min • Clippers</p>
                      </div>
                      <span className="font-bold text-slate-300 text-[11px]">$20.00</span>
                    </div>
                  </div>
                </div>

                {/* Staff Selector */}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">2. Choose Staff</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-2 text-center">
                      <p className="font-bold text-white text-[10px]">Alex (Alex)</p>
                      <p className="text-[8px] text-slate-400">Next available</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center opacity-60">
                      <p className="font-bold text-white text-[10px]">Jordan</p>
                      <p className="text-[8px] text-slate-400">Senior Stylist</p>
                    </div>
                  </div>
                </div>

                {/* Date & Time Picker */}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">3. Time slot</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["9:00", "9:30", "10:00", "10:30"].map((t, idx) => (
                      <div
                        key={t}
                        className={`py-1.5 rounded-lg text-center font-bold text-[10px] ${
                          idx === 1 ? "bg-amber-500 text-slate-950" : "bg-slate-900 border border-slate-800 text-slate-300"
                        }`}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm CTA */}
                <button className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg mt-4 active:scale-98 transition-transform text-[11px]">
                  Confirm Appointment
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 4. PAIN POINTS SECTION */}
      <section className="py-24 bg-white text-slate-800 px-4">
        <div className="container mx-auto max-w-7xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-slate-900">
              Sound familiar?
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base">
              Traditional booking platforms build networks for themselves, not for you. Here is why modern shops are looking for an alternative.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300 flex gap-4">
              <span className="text-2xl mt-1">📱</span>
              <div>
                <h3 className="font-bold text-slate-900 font-display text-lg mb-2">App Fatigue</h3>
                <p className="text-slate-600 text-sm">
                  &quot;Clients complain about downloading yet another app.&quot; With SlotSync, they just tap, select, and book on any mobile browser.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300 flex gap-4">
              <span className="text-2xl mt-1">💸</span>
              <div>
                <h3 className="font-bold text-slate-900 font-display text-lg mb-2">The Staff Tax</h3>
                <p className="text-slate-600 text-sm">
                  &quot;Booksy charges $10/month per staff member.&quot; Scaling your business should not penalize you. Our flat rate includes everyone.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300 flex gap-4">
              <span className="text-2xl mt-1">🥊</span>
              <div>
                <h3 className="font-bold text-slate-900 font-display text-lg mb-2">Ignored Chargeback Evidence</h3>
                <p className="text-slate-600 text-sm">
                  &quot;A chargeback happened and Booksy ignored your evidence.&quot; You lose your hard-earned cash because of zero human support.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300 flex gap-4">
              <span className="text-2xl mt-1">🔒</span>
              <div>
                <h3 className="font-bold text-slate-900 font-display text-lg mb-2">Locked-In Reviews</h3>
                <p className="text-slate-600 text-sm">
                  &quot;Reviews are locked inside Booksy, not on Google.&quot; If you ever leave them, your hard-earned reputation is lost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPARISON TABLE SECTION */}
      <section id="comparison" className="py-24 bg-slate-900 text-white px-4 border-t border-slate-800">
        <div className="container mx-auto max-w-5xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display">
              How SlotSync compares
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              We did the math. See how we stand against Booksy and Fresha.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-sm">
            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950">
                  <th className="py-5 px-6 font-semibold text-slate-300">Feature</th>
                  <th className="py-5 px-6 text-center font-bold text-amber-500 bg-amber-500/5 border-x border-slate-800">
                    SlotSync
                  </th>
                  <th className="py-5 px-6 text-center font-semibold text-slate-400">Booksy</th>
                  <th className="py-5 px-6 text-center font-semibold text-slate-400">Fresha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4.5 px-6 font-medium text-slate-200">No App required for clients</td>
                  <td className="py-4.5 px-6 text-center text-emerald-400 bg-amber-500/5 font-bold border-x border-slate-800">✓</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4.5 px-6 font-medium text-slate-200">Flat pricing (no per-staff fees)</td>
                  <td className="py-4.5 px-6 text-center text-emerald-400 bg-amber-500/5 font-bold border-x border-slate-800">✓</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4.5 px-6 font-medium text-slate-200">Direct Stripe payouts</td>
                  <td className="py-4.5 px-6 text-center text-emerald-400 bg-amber-500/5 font-bold border-x border-slate-800">✓</td>
                  <td className="py-4.5 px-6 text-center text-emerald-400">✓</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4.5 px-6 font-medium text-slate-200">Google Review automation</td>
                  <td className="py-4.5 px-6 text-center text-emerald-400 bg-amber-500/5 font-bold border-x border-slate-800">✓</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4.5 px-6 font-medium text-slate-200">Zero Commission</td>
                  <td className="py-4.5 px-6 text-center text-emerald-400 bg-amber-500/5 font-bold border-x border-slate-800">✓</td>
                  <td className="py-4.5 px-6 text-center text-emerald-400">✓</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4.5 px-6 font-medium text-slate-200">Human Support</td>
                  <td className="py-4.5 px-6 text-center text-emerald-400 bg-amber-500/5 font-bold border-x border-slate-800">✓</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                  <td className="py-4.5 px-6 text-center text-rose-500">✗</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="py-24 bg-slate-50 text-slate-800 px-4">
        <div className="container mx-auto max-w-7xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-slate-900">
              Set up in minutes
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              The easiest way to streamline your booking flow.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto relative">
            
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Step1Icon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-xl mb-3">1. Get Your Custom Link</h3>
              <p className="text-slate-600 text-sm">
                Claim your custom web address (`slotsync.com/yourbrand`). This is your new shop window.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Step2Icon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-xl mb-3">2. Book in Seconds</h3>
              <p className="text-slate-600 text-sm">
                Clients select a service, staff, date, and confirm. No app download or registration required.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Step3Icon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-xl mb-3">3. Autopilot Growth</h3>
              <p className="text-slate-600 text-sm">
                SlotSync follows up via SMS to automatically collect 5-star reviews on Google to rank you higher.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FEATURES GRID */}
      <section id="features" className="py-24 bg-white text-slate-800 px-4 border-t border-slate-100">
        <div className="container mx-auto max-w-7xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-slate-900">
              Engineered for busy operators
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              Every booking tool you need, built cleanly for high-volume service businesses.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition-colors border border-slate-200/50">
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                <AppFreeIcon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-base mb-2">No App Required</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Zero friction booking page that loads instantly in any mobile browser.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition-colors border border-slate-200/50">
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                <FlatPriceIcon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-base mb-2">Flat $19/Month</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                One clear flat subscription regardless of how many staff or operators you support.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition-colors border border-slate-200/50">
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                <StripeIcon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-base mb-2">Direct Stripe Payouts</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                We never hold your money. Payments hit your bank account directly via Stripe.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition-colors border border-slate-200/50">
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                <ReviewIcon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-base mb-2">Google Review Auto-Request</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Follows up automatically to request Google Reviews to boost local search rankings.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition-colors border border-slate-200/50">
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                <RemindersIcon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-base mb-2">SMS & Email Reminders</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Reduce no-shows with automated calendar notifications and reminders.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition-colors border border-slate-200/50">
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                <SyncIcon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-base mb-2">Calendar Sync</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Two-way sync with Google Calendar, Apple iCal, and Outlook.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition-colors border border-slate-200/50">
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                <ShieldIcon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-base mb-2">No-Show Fee Protection</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Hold credit cards on file securely and charge automatic cancellation fees.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition-colors border border-slate-200/50">
              <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                <SupportIcon />
              </div>
              <h3 className="font-bold text-slate-900 font-display text-base mb-2">Real Human Support</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Skip the generic chat bots. Reach real human success experts anytime.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-slate-900 text-white px-4 border-t border-slate-800">
        <div className="container mx-auto max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display">
              Fair, flat-rate pricing
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              No surprises. Zero commission. Pick a plan that grows with you.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
            
            {/* Free Tier */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-left hover:border-slate-700 transition-colors relative">
              <h3 className="font-bold text-slate-300 font-display text-xl">Free Tier</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">$0</span>
                <span className="ml-1 text-slate-400 text-sm">/forever</span>
              </div>
              <p className="mt-3 text-slate-400 text-xs">
                Perfect for solo professionals just testing the booking water.
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-800/80 pt-6 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> 1 Staff operator
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Up to 30 bookings / month
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> SMS & Email notifications
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <span className="text-slate-500">✗</span> Google Reviews automation
                </li>
              </ul>
              <button 
                onClick={scrollToWaitlist}
                className="mt-8 block w-full text-center bg-slate-900 border border-slate-700 hover:border-slate-600 text-white font-semibold py-2.5 rounded-xl transition-all text-xs"
              >
                Join Free Waitlist
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-950 border-2 border-amber-500 rounded-2xl p-8 text-left relative shadow-xl shadow-amber-500/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </div>
              <h3 className="font-bold text-white font-display text-xl">Pro Plan</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">$19</span>
                <span className="ml-1 text-slate-400 text-sm">/month</span>
              </div>
              <p className="mt-3 text-slate-300 text-xs">
                Designed for high-growth shops, salons, and teams.
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-800/80 pt-6 text-xs text-slate-200">
                <li className="flex items-center gap-2 font-semibold text-white">
                  <span className="text-amber-500">✓</span> Unlimited Staff Operators
                </li>
                <li className="flex items-center gap-2 font-semibold text-white">
                  <span className="text-amber-500">✓</span> Unlimited Bookings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> Auto Google Review requests
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> SMS + email reminders
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> Advanced analytics & dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 24/7 Priority human support
                </li>
              </ul>
              
              <button 
                onClick={scrollToWaitlist}
                className="mt-8 block w-full text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 text-xs"
              >
                Join Pro Waitlist
              </button>

              <div className="mt-4 text-center">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  No per-staff fees. Ever.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. SWITCHING SECTION */}
      <section id="switching" className="py-24 bg-white text-slate-800 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-slate-900">
              Coming from Booksy?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              Moving your business should not be painful. We make switching effortless.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 text-left max-w-3xl mx-auto space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-xl">⚡</span>
                <div>
                  <h4 className="font-bold text-slate-900 font-display text-base">1-Click Client List Import</h4>
                  <p className="text-slate-600 text-xs mt-1">Export your CSV client database from Booksy and upload it to SlotSync. Done in 30 seconds.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-xl">🛠️</span>
                <div>
                  <h4 className="font-bold text-slate-900 font-display text-base">Free Setup Assistance</h4>
                  <p className="text-slate-600 text-xs mt-1">Send us your existing booking page. A SlotSync representative will build your services and schedule template for free.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-xl">🎁</span>
                <div>
                  <h4 className="font-bold text-slate-900 font-display text-base">3 Months Completely Free</h4>
                  <p className="text-slate-600 text-xs mt-1">To cover any active subscription periods, we will give you your first 90 days on Pro on us. Zero charge.</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <button 
                onClick={scrollToWaitlist}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 text-xs shadow-md transition-all active:scale-95"
              >
                Claim Your Switch Offer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WAITLIST FORM SECTION */}
      <section id="waitlist" className="py-24 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white px-4 border-t border-slate-800 relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="container mx-auto max-w-xl text-center space-y-8 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border border-amber-500/20">
              🔥 Join the Launch Waitlist
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display">
              Lock in early access
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto">
              Ready for commission-free scheduling without forced client app installs? Secure your spot now.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 space-y-4 text-center shadow-xl shadow-amber-500/5"
              >
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-500/30">
                  ✓
                </div>
                <h3 className="text-xl font-bold font-display text-white">You&apos;re on the list!</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
                  Thank you for joining. We will email you with your early access invite and your 3 months free switch credentials as soon as we open in your city.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleFormSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 text-left shadow-2xl"
              >
                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@business.com"
                    required
                    className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl px-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all placeholder-slate-600"
                  />
                </div>

                {/* Business Type Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="businessType" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Business Type
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                      className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl px-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all"
                    >
                      <option value="" disabled>Select business type</option>
                      <option value="Hair Salon">Hair Salon</option>
                      <option value="Barber Shop">Barber Shop</option>
                      <option value="Nail Salon">Nail Salon</option>
                      <option value="Beauty / Spa">Beauty &amp; Spa</option>
                      <option value="Fitness / Personal Trainer">Fitness &amp; Trainer</option>
                      <option value="Other">Other Service</option>
                    </select>
                  </div>

                  {/* Country Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="country" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl px-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all"
                    >
                      <option value="" disabled>Select country</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? "Securing Your Spot..." : "Join Launch Waitlist"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 10. EXTRA FOOTER LINKS */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 px-4 text-xs md:text-sm">
        <div className="container mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 space-y-4">
            <span className="text-lg font-bold font-display text-white">SlotSync</span>
            <p className="text-slate-500 text-xs max-w-xs">
              Smart scheduling software for high-volume shops, studios, and salons. Commission-free, app-free booking flow.
            </p>
          </div>
          <div className="space-y-3">
            <span className="font-bold text-slate-300 text-xs tracking-wider uppercase">Legal</span>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="font-bold text-slate-300 text-xs tracking-wider uppercase">Contact</span>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="mailto:support@slotsync.com" className="hover:text-white transition-colors">support@slotsync.com</a></li>
              <li><span className="text-slate-500">24/7 Human support line</span></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}
