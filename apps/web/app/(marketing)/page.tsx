"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { joinWaitlist } from "@/app/actions";
import {
  CheckCircle2,
  Scissors,
  Dumbbell,
  Stethoscope,
  Sparkles,
  Zap,
  CreditCard,
  Smartphone,
  Users,
  Bell,
  Link as LinkIcon,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock,
} from "lucide-react";

/* ─── Fade-in wrapper ─── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Service cards data ─── */
const SERVICES = [
  {
    icon: <Scissors className="w-7 h-7" />,
    title: "Hair & Beauty Salons",
    description: "Manage multiple stylists, handle overlapping appointments, and automatically remind clients.",
    gradient: "from-rose-100 to-pink-50",
    iconBg: "bg-rose-100 text-rose-600",
  },
  {
    icon: <Dumbbell className="w-7 h-7" />,
    title: "Fitness & Trainers",
    description: "Schedule 1-on-1 sessions or group classes with capacity limits and recurring billing.",
    gradient: "from-emerald-100 to-green-50",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: <Stethoscope className="w-7 h-7" />,
    title: "Clinics & Wellness",
    description: "Secure, private bookings with intake forms for multiple practitioners and rooms.",
    gradient: "from-blue-100 to-sky-50",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: <Sparkles className="w-7 h-7" />,
    title: "Spas & Nail Studios",
    description: "Group appointments, package deals, and beautiful booking pages that convert visitors.",
    gradient: "from-violet-100 to-purple-50",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    icon: <Star className="w-7 h-7" />,
    title: "Tattoo & Piercing",
    description: "Deposit collection, portfolio showcase, and consultation scheduling built in.",
    gradient: "from-amber-100 to-orange-50",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Consulting & Coaching",
    description: "Video call integration, timezone handling, and smart buffer times between sessions.",
    gradient: "from-slate-100 to-gray-50",
    iconBg: "bg-slate-200 text-slate-600",
  },
];

/* ─── Feature cards data ─── */
const FEATURES = [
  { icon: <Bell className="w-6 h-6" />, title: "Automated Reminders", desc: "Reduce no-shows by 40% with smart SMS and email notifications." },
  { icon: <LinkIcon className="w-6 h-6" />, title: "Custom Booking Links", desc: "Share your availability on social media, your website, or via DMs." },
  { icon: <Users className="w-6 h-6" />, title: "Team Management", desc: "Sync staff calendars, set permissions, and track performance." },
  { icon: <Clock className="w-6 h-6" />, title: "Smart Scheduling", desc: "Auto-detect conflicts, buffer times, and timezone differences." },
];

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
      setError(res.error || "Something went wrong.");
    }
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-rose-200/40 via-amber-100/30 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-100/40 via-violet-100/20 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <FadeIn>
            <p className="text-sm font-medium text-slate-500 tracking-wide mb-4">
              Simplify your bookings with SlotSync
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08] mb-6">
              Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Smarter.</span>{" "}
              <br className="hidden md:block" />
              Grow Faster.
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              The universal booking platform for salons, clinics, trainers, spas, and every modern service business. No client app needed. No hidden fees.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#waitlist"
                className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Get Early Access <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold border border-slate-200 text-slate-700 hover:bg-white hover:shadow-md transition-all"
              >
                Explore Services
              </a>
            </div>
          </FadeIn>

          {/* Hero visual – sunrise illustration */}
          <FadeIn delay={0.4} className="mt-16">
            <div className="relative max-w-3xl mx-auto">
              <div className="relative w-full rounded-[2rem] overflow-hidden border border-slate-200/50 shadow-xl shadow-slate-200/30">
                <img 
                  src="/hero-sunrise.png" 
                  alt="SlotSync — beautiful booking for service businesses" 
                  className="w-full h-auto object-cover"
                />
                {/* Floating glass card */}
                <div className="absolute top-6 right-6 md:top-10 md:right-10 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-slate-200/40 border border-white/80 max-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Booking Confirmed</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Haircut with Sarah — Tomorrow at 2:00 PM</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. FEATURES
      ══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Features</p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Everything you need, nothing you don't</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:shadow-slate-100/60 transition-shadow h-full">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. WHY US / USPs
      ══════════════════════════════════════════════════════════════════ */}
      <section id="why-us" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-2">Why SlotSync</p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Built differently</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Traditional booking apps are clunky, force your clients to download an app, and hold onto your money. We do things better.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0}>
              <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-8 border border-rose-100/50 h-full">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Smartphone className="w-7 h-7 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">No Client App Required</h3>
                <p className="text-slate-600 leading-relaxed">Clients book instantly through a beautiful web link. No passwords, no app downloads. Just frictionless conversion.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl p-8 border border-sky-100/50 h-full">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Zap className="w-7 h-7 text-sky-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Direct Stripe Payouts</h3>
                <p className="text-slate-600 leading-relaxed">We don't hold your funds. With Stripe Connect, money flows directly to your bank account. Take deposits to eliminate no-shows.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 border border-violet-100/50 h-full">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Users className="w-7 h-7 text-violet-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Staff Mastery</h3>
                <p className="text-slate-600 leading-relaxed">Staff get their own logins and schedules while you get a bird's-eye view of everything. Perfect for teams of any size.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. SERVICES – Industry scroll cards
      ══════════════════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-2">Industries</p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">One platform. Every service.</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">From hair salons to medical clinics, SlotSync adapts to your industry with purpose-built features.</p>
            </div>
          </FadeIn>

          {/* Horizontally scrollable on mobile, grid on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.08}>
                <div className={`bg-gradient-to-br ${s.gradient} rounded-3xl p-8 border border-white/50 hover:shadow-xl hover:shadow-slate-100/50 hover:-translate-y-1 transition-all duration-300 h-full cursor-default`}>
                  <div className={`w-14 h-14 ${s.iconBg} rounded-2xl flex items-center justify-center mb-5`}>
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{s.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. PRICING – 3-Tier
      ══════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-violet-500 uppercase tracking-wider mb-2">Pricing</p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
              <p className="text-lg text-slate-500">Start for free. Upgrade when you grow.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Starter */}
            <FadeIn delay={0}>
              <div className="bg-[#faf9f7] rounded-3xl p-8 border border-slate-200 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-slate-500 mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 pb-6 border-b border-slate-200">Perfect for solo professionals just getting started.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-slate-700 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> 1 Staff Member</li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Up to 50 bookings/mo</li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Basic booking page</li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Email notifications</li>
                </ul>
                <a href="#waitlist" className="w-full py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors font-semibold text-center block">Start Free</a>
              </div>
            </FadeIn>

            {/* Professional (Highlighted) */}
            <FadeIn delay={0.1}>
              <div className="bg-slate-900 rounded-3xl p-8 relative h-full flex flex-col shadow-2xl shadow-slate-900/10 md:-translate-y-4">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-rose-400 to-amber-400 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Most Popular</div>
                <h3 className="text-lg font-semibold text-slate-400 mb-2">Professional</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold text-white">$29</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 pb-6 border-b border-slate-700">Everything you need to run a modern service business.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" /> Up to 5 Staff</li>
                  <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" /> Unlimited Bookings</li>
                  <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" /> Stripe Payments</li>
                  <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" /> SMS Reminders</li>
                  <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" /> Custom Branding</li>
                </ul>
                <a href="#waitlist" className="w-full py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 transition-colors font-bold text-center block">Get Early Access</a>
              </div>
            </FadeIn>

            {/* Business */}
            <FadeIn delay={0.2}>
              <div className="bg-[#faf9f7] rounded-3xl p-8 border border-slate-200 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-slate-500 mb-2">Business</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold text-slate-900">$79</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 pb-6 border-b border-slate-200">For large clinics, franchises, and high-volume operations.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-slate-700 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Unlimited Staff</li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Advanced Analytics</li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Multi-location</li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> Priority Support</li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> API Access</li>
                </ul>
                <a href="#waitlist" className="w-full py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors font-semibold text-center block">Join Waitlist</a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          6. WAITLIST FORM
      ══════════════════════════════════════════════════════════════════ */}
      <section id="waitlist" className="py-24 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-rose-100/50 via-amber-50/30 to-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Secure your spot</h2>
              <p className="text-slate-500 text-lg">Join the waitlist and lock in 3 months free when we launch in your area.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100/50">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">You're on the list!</h3>
                    <p className="text-slate-500">We'll email you with your early access invite as soon as your spot opens.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleFormSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {error && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
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
                        className="w-full h-12 bg-[#faf9f7] border border-slate-200 rounded-xl px-4 text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="businessType" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                          Business Type
                        </label>
                        <select
                          id="businessType"
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          required
                          className="w-full h-12 bg-[#faf9f7] border border-slate-200 rounded-xl px-4 text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all appearance-none"
                        >
                          <option value="" disabled>Select type</option>
                          <option value="Hair Salon">Hair Salon</option>
                          <option value="Barber Shop">Barber Shop</option>
                          <option value="Nail Salon">Nail Salon</option>
                          <option value="Beauty / Spa">Beauty &amp; Spa</option>
                          <option value="Fitness / Personal Trainer">Fitness &amp; Trainer</option>
                          <option value="Medical / Clinic">Medical / Clinic</option>
                          <option value="Tattoo / Piercing">Tattoo &amp; Piercing</option>
                          <option value="Consulting / Coaching">Consulting</option>
                          <option value="Other">Other Service</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="country" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className="w-full h-12 bg-[#faf9f7] border border-slate-200 rounded-xl px-4 text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all appearance-none"
                        >
                          <option value="" disabled>Select country</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="India">India</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Joining..." : <><span>Join Free Waitlist</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
