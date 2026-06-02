"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { joinWaitlist } from "@/app/actions";
import {
  CheckCircle2,
  Scissors,
  Dumbbell,
  Stethoscope,
  Sparkles,
  Zap,
  Smartphone,
  Users,
  Bell,
  Link as LinkIcon,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock,
  Calendar,
} from "lucide-react";

/* ─── Fade-in-on-scroll wrapper ─── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─── */
const SERVICES = [
  { icon: <Scissors className="w-6 h-6" />, title: "Hair & Beauty", desc: "Multi-stylist scheduling with automatic conflict detection.", color: "from-coral-100 to-coral-50", iconColor: "text-coral-400 bg-coral-50" },
  { icon: <Dumbbell className="w-6 h-6" />, title: "Fitness & Trainers", desc: "1-on-1 sessions, group classes, and capacity management.", color: "from-sage-100 to-sage-50", iconColor: "text-sage-500 bg-sage-50" },
  { icon: <Stethoscope className="w-6 h-6" />, title: "Clinics & Wellness", desc: "Private bookings with intake forms for multiple rooms.", color: "from-cream-200 to-cream-100", iconColor: "text-terra bg-cream-100" },
  { icon: <Sparkles className="w-6 h-6" />, title: "Spas & Nail Studios", desc: "Package deals, group bookings, and beautiful pages.", color: "from-coral-50 to-cream-50", iconColor: "text-coral-300 bg-coral-50" },
  { icon: <Star className="w-6 h-6" />, title: "Tattoo & Piercing", desc: "Deposit collection and consultation scheduling.", color: "from-sage-50 to-cream-50", iconColor: "text-sage-400 bg-sage-50" },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Consulting", desc: "Timezone handling and buffer times between sessions.", color: "from-cream-100 to-sage-50", iconColor: "text-[#2C2C2C]/60 bg-sage-50" },
];

const FEATURES = [
  { icon: <Bell className="w-5 h-5" />, title: "Smart Reminders", desc: "Reduce no-shows by 40% with automated SMS and email." },
  { icon: <LinkIcon className="w-5 h-5" />, title: "Booking Links", desc: "Share a beautiful link on socials, websites, or DMs." },
  { icon: <Users className="w-5 h-5" />, title: "Team Management", desc: "Staff calendars, permissions, and performance tracking." },
  { icon: <Clock className="w-5 h-5" />, title: "Smart Scheduling", desc: "Auto-detect conflicts, buffer times, and timezones." },
];

export default function MarketingLandingPage() {
  const [formData, setFormData] = useState({ email: "", businessType: "", country: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-8 px-6 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn>
            <p className="text-sm tracking-[0.2em] uppercase text-[#D4846A] mb-6 font-medium">
              Simplify your bookings
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="font-display text-6xl md:text-8xl font-light text-[#2C2C2C] leading-[1.05] mb-8 tracking-tight">
              Bookings.{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-coral-200 to-coral-400">
                Simplified.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-lg text-[#2C2C2C]/55 mb-12 max-w-xl mx-auto leading-relaxed">
              The universal platform for salons, clinics, trainers, spas, and every modern service business. No client app needed.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#waitlist"
                className="w-full sm:w-auto bg-[#D4846A] hover:bg-[#C07558] text-white px-8 py-4 rounded-2xl text-base font-medium transition-all hover:shadow-xl hover:shadow-coral-200/30 active:scale-[0.97] flex items-center justify-center gap-2"
              >
                Get Early Access <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-medium glass-card text-[#2C2C2C]/70 hover:text-[#2C2C2C] hover:shadow-lg transition-all"
              >
                Explore Services
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Hero visual — coral gradient orb + floating glass card */}
        <FadeIn delay={0.3} className="mt-20">
          <div className="relative max-w-3xl mx-auto">
            {/* The main orb */}
            <div className="relative w-full h-72 md:h-96 rounded-[2.5rem] overflow-hidden">
              {/* Gradient sky */}
              <div className="absolute inset-0 bg-gradient-to-t from-sage-100 via-cream-100 to-coral-50" />
              {/* Coral sun orb */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-56 h-56 md:w-72 md:h-72 rounded-full bg-gradient-to-t from-[#F2A99A] to-[#F7C4BC] opacity-80 blur-[2px]" />
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-52 h-52 md:w-64 md:h-64 rounded-full bg-gradient-to-t from-[#F2A99A]/90 to-[#F7C4BC]/70" />
              {/* Cloud shapes */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-28">
                  <path d="M0,60 C150,20 300,80 450,50 C600,20 750,70 900,40 C1050,10 1150,50 1200,30 L1200,120 L0,120 Z" fill="#E8EDE6" />
                  <path d="M0,80 C200,50 400,90 600,60 C800,30 1000,70 1200,50 L1200,120 L0,120 Z" fill="#EEF1EC" fillOpacity="0.7" />
                </svg>
              </div>
            </div>

            {/* Floating glass card - booking preview */}
            <div className="absolute top-8 right-4 md:top-12 md:right-8 glass-card rounded-2xl p-5 shadow-xl max-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-sage-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2C2C2C]">Today</p>
                  <p className="text-[10px] text-[#2C2C2C]/40">3 appointments</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2">
                  <div className="w-1 h-8 rounded-full bg-[#D4846A]" />
                  <div>
                    <p className="text-[10px] font-medium text-[#2C2C2C]">Hair Color — Sarah</p>
                    <p className="text-[9px] text-[#2C2C2C]/40">10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2">
                  <div className="w-1 h-8 rounded-full bg-sage-400" />
                  <div>
                    <p className="text-[10px] font-medium text-[#2C2C2C]">Blowout — Emily</p>
                    <p className="text-[9px] text-[#2C2C2C]/40">11:30 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating confirmation card - bottom left */}
            <div className="absolute bottom-20 left-4 md:bottom-28 md:left-8 glass-card rounded-xl p-3 shadow-lg max-w-[170px]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#2C2C2C]">Booking confirmed</p>
                  <p className="text-[9px] text-[#2C2C2C]/40">Tomorrow at 2 PM</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════ */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-[#D4846A] mb-3 font-medium">Features</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-[#2C2C2C]">
                Everything you need,<br />nothing you don't
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div className="glass-card rounded-2xl p-6 hover:shadow-lg hover:shadow-sage-200/30 transition-all h-full group">
                  <div className="w-11 h-11 rounded-xl bg-coral-50 flex items-center justify-center text-[#D4846A] mb-4 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold text-[#2C2C2C] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#2C2C2C]/50 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY US / USPs
      ═══════════════════════════════════════════════ */}
      <section id="why-us" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-[#D4846A] mb-3 font-medium">Why SlotSync</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-[#2C2C2C] mb-4">Built differently</h2>
              <p className="text-[#2C2C2C]/50 max-w-lg mx-auto">Traditional booking apps are clunky and hold onto your money. We do things better.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeIn>
              <div className="glass-card rounded-3xl p-8 h-full hover:shadow-xl hover:shadow-coral-100/30 transition-all">
                <div className="w-14 h-14 bg-coral-50 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7 text-coral-400" />
                </div>
                <h3 className="text-xl font-display font-semibold text-[#2C2C2C] mb-3">No Client App</h3>
                <p className="text-[#2C2C2C]/50 leading-relaxed">Clients book through a beautiful web link. No passwords, no downloads. Just frictionless conversion.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="glass-card rounded-3xl p-8 h-full hover:shadow-xl hover:shadow-sage-100/30 transition-all">
                <div className="w-14 h-14 bg-sage-50 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-sage-500" />
                </div>
                <h3 className="text-xl font-display font-semibold text-[#2C2C2C] mb-3">Direct Payouts</h3>
                <p className="text-[#2C2C2C]/50 leading-relaxed">We don't hold your funds. Stripe Connect sends money straight to your bank. Take deposits to stop no-shows.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="glass-card rounded-3xl p-8 h-full hover:shadow-xl hover:shadow-cream-200/30 transition-all">
                <div className="w-14 h-14 bg-cream-100 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-terra" />
                </div>
                <h3 className="text-xl font-display font-semibold text-[#2C2C2C] mb-3">Multi-Staff</h3>
                <p className="text-[#2C2C2C]/50 leading-relaxed">Staff get their own logins and schedules. You get a bird's-eye view of everything.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════════ */}
      <section id="services" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-[#D4846A] mb-3 font-medium">Industries</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-[#2C2C2C] mb-4">One platform. Every service.</h2>
              <p className="text-[#2C2C2C]/50 max-w-lg mx-auto">From hair salons to medical clinics, SlotSync adapts to your industry.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.06}>
                <div className={`glass-card rounded-2xl p-7 hover:shadow-lg transition-all h-full hover:-translate-y-0.5`}>
                  <div className={`w-12 h-12 ${s.iconColor} rounded-xl flex items-center justify-center mb-4`}>
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#2C2C2C]/50 leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════ */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-[#D4846A] mb-3 font-medium">Pricing</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-[#2C2C2C] mb-4">Simple, transparent pricing</h2>
              <p className="text-[#2C2C2C]/50">Start free. Scale when you grow.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Starter */}
            <FadeIn>
              <div className="glass-card rounded-3xl p-8 h-full flex flex-col">
                <h3 className="text-base font-medium text-[#2C2C2C]/50 mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-display font-light text-[#2C2C2C]">$0</span>
                  <span className="text-[#2C2C2C]/40 text-sm">/mo</span>
                </div>
                <p className="text-sm text-[#2C2C2C]/40 mb-8 pb-6 border-b border-sage-200/30">For solo professionals getting started.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-[#2C2C2C]/70"><CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" /> 1 Staff Member</li>
                  <li className="flex items-center gap-3 text-sm text-[#2C2C2C]/70"><CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" /> 50 bookings/mo</li>
                  <li className="flex items-center gap-3 text-sm text-[#2C2C2C]/70"><CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" /> Basic booking page</li>
                  <li className="flex items-center gap-3 text-sm text-[#2C2C2C]/70"><CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" /> Email notifications</li>
                </ul>
                <a href="#waitlist" className="w-full py-3 rounded-xl border border-sage-200 text-[#2C2C2C]/70 hover:bg-white/50 transition-colors font-medium text-center block text-sm">Start Free</a>
              </div>
            </FadeIn>

            {/* Professional */}
            <FadeIn delay={0.1}>
              <div className="bg-[#2C2C2C] rounded-3xl p-8 h-full flex flex-col md:-translate-y-4 shadow-2xl shadow-[#2C2C2C]/10 relative">
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-coral-200 to-[#D4846A] text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Popular</div>
                <h3 className="text-base font-medium text-white/50 mb-2">Professional</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-display font-light text-white">$29</span>
                  <span className="text-white/30 text-sm">/mo</span>
                </div>
                <p className="text-sm text-white/30 mb-8 pb-6 border-b border-white/10">Everything for a modern service business.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-[#D4846A] shrink-0" /> Up to 5 Staff</li>
                  <li className="flex items-center gap-3 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-[#D4846A] shrink-0" /> Unlimited Bookings</li>
                  <li className="flex items-center gap-3 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-[#D4846A] shrink-0" /> Stripe Payments</li>
                  <li className="flex items-center gap-3 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-[#D4846A] shrink-0" /> SMS Reminders</li>
                  <li className="flex items-center gap-3 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-[#D4846A] shrink-0" /> Custom Branding</li>
                </ul>
                <a href="#waitlist" className="w-full py-3 rounded-xl bg-[#D4846A] text-white hover:bg-[#C07558] transition-colors font-semibold text-center block text-sm">Get Early Access</a>
              </div>
            </FadeIn>

            {/* Business */}
            <FadeIn delay={0.2}>
              <div className="glass-card rounded-3xl p-8 h-full flex flex-col">
                <h3 className="text-base font-medium text-[#2C2C2C]/50 mb-2">Business</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-display font-light text-[#2C2C2C]">$79</span>
                  <span className="text-[#2C2C2C]/40 text-sm">/mo</span>
                </div>
                <p className="text-sm text-[#2C2C2C]/40 mb-8 pb-6 border-b border-sage-200/30">For clinics, franchises, and high-volume ops.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-[#2C2C2C]/70"><CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" /> Unlimited Staff</li>
                  <li className="flex items-center gap-3 text-sm text-[#2C2C2C]/70"><CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" /> Advanced Analytics</li>
                  <li className="flex items-center gap-3 text-sm text-[#2C2C2C]/70"><CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" /> Multi-location</li>
                  <li className="flex items-center gap-3 text-sm text-[#2C2C2C]/70"><CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" /> Priority Support</li>
                  <li className="flex items-center gap-3 text-sm text-[#2C2C2C]/70"><CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" /> API Access</li>
                </ul>
                <a href="#waitlist" className="w-full py-3 rounded-xl border border-sage-200 text-[#2C2C2C]/70 hover:bg-white/50 transition-colors font-medium text-center block text-sm">Join Waitlist</a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WAITLIST
      ═══════════════════════════════════════════════ */}
      <section id="waitlist" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coral-50/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="font-display text-4xl md:text-5xl font-light text-[#2C2C2C] mb-4">Secure your spot</h2>
              <p className="text-[#2C2C2C]/50">Join the waitlist and lock in 3 months free when we launch.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="glass-card rounded-3xl p-8 shadow-xl shadow-sage-200/20">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center py-10">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-[#2C2C2C] mb-2">You're on the list!</h3>
                    <p className="text-[#2C2C2C]/50">We'll email you when your spot opens.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleFormSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                    {error && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm">{error}</div>
                    )}
                    <div>
                      <label htmlFor="email" className="text-xs font-semibold text-[#2C2C2C]/40 uppercase tracking-wider block mb-1.5">Email</label>
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="name@business.com" required className="w-full h-12 bg-white/50 border border-sage-200/50 rounded-xl px-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-coral-100 transition-all placeholder:text-[#2C2C2C]/25" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="businessType" className="text-xs font-semibold text-[#2C2C2C]/40 uppercase tracking-wider block mb-1.5">Business Type</label>
                        <select id="businessType" name="businessType" value={formData.businessType} onChange={handleInputChange} required className="w-full h-12 bg-white/50 border border-sage-200/50 rounded-xl px-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-coral-100 transition-all appearance-none">
                          <option value="" disabled>Select type</option>
                          <option value="Hair Salon">Hair Salon</option>
                          <option value="Barber Shop">Barber Shop</option>
                          <option value="Nail Salon">Nail Salon</option>
                          <option value="Beauty / Spa">Beauty &amp; Spa</option>
                          <option value="Fitness / Personal Trainer">Fitness &amp; Trainer</option>
                          <option value="Medical / Clinic">Medical / Clinic</option>
                          <option value="Tattoo / Piercing">Tattoo &amp; Piercing</option>
                          <option value="Consulting / Coaching">Consulting</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="country" className="text-xs font-semibold text-[#2C2C2C]/40 uppercase tracking-wider block mb-1.5">Country</label>
                        <select id="country" name="country" value={formData.country} onChange={handleInputChange} required className="w-full h-12 bg-white/50 border border-sage-200/50 rounded-xl px-4 text-[#2C2C2C] focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-coral-100 transition-all appearance-none">
                          <option value="" disabled>Select country</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="India">India</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#D4846A] hover:bg-[#C07558] text-white py-4 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-coral-200/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
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
