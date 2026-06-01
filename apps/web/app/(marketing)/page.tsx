"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { joinWaitlist } from "@/app/actions";
import Link from "next/link";
import { 
  CheckCircle2, 
  Scissors, 
  Dumbbell, 
  Stethoscope,
  Sparkles,
  Zap,
  CreditCard,
  Smartphone
} from "lucide-react";

const SERVICES = [
  {
    id: "salon",
    title: "Hair & Beauty Salons",
    icon: <Scissors className="w-8 h-8 mb-4 text-primary" />,
    description: "Manage multiple stylists, handle overlapping appointments, and automatically remind clients to reduce no-shows.",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: "fitness",
    title: "Fitness & Trainers",
    icon: <Dumbbell className="w-8 h-8 mb-4 text-primary" />,
    description: "Schedule 1-on-1 sessions or group classes. Seamlessly integrate class capacity and recurring billing.",
    color: "from-emerald-400 to-cyan-500"
  },
  {
    id: "medical",
    title: "Clinics & Wellness",
    icon: <Stethoscope className="w-8 h-8 mb-4 text-primary" />,
    description: "Secure, private bookings with intake forms and flexible scheduling for multiple practitioners and rooms.",
    color: "from-rose-400 to-orange-500"
  }
];

export default function MarketingLandingPage() {
  // Form State
  const [formData, setFormData] = useState({ email: "", businessType: "", country: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Scroll animations for the 3D Service Section
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll progress into 3D rotations and active indices
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 0, 20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);
  
  // Calculate which service is active based on scroll (0 to 1 split into 3 chunks)
  const activeServiceIndex = useTransform(scrollYProgress, (pos) => {
    if (pos < 0.33) return 0;
    if (pos < 0.66) return 1;
    return 2;
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Update state when scroll transforms change (for rendering React elements conditionally)
  activeServiceIndex.on("change", (latest) => setActiveIndex(latest));

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

  const scrollToWaitlist = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#0b1326] text-[#dbe2fd] font-body-md selection:bg-primary selection:text-white min-h-screen overflow-x-hidden">
      
      {/* 1. Header (Clear Login / Sign Up) */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-white/5">
        <nav className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary w-6 h-6" />
            <span className="text-2xl font-bold tracking-tight text-white">SlotSync</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <button 
              onClick={scrollToWaitlist}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-[0_0_20px_rgba(99,91,255,0.3)] hover:shadow-[0_0_30px_rgba(99,91,255,0.5)] hover:scale-105 transition-all"
            >
              Sign up
            </button>
          </div>
        </nav>
      </header>
      
      <main>
        {/* 2. Hero Section (Clean, industry-agnostic, crisp) */}
        <section className="relative pt-40 pb-20 px-6 overflow-hidden">
          {/* Background Mesh Gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-[100px] mix-blend-screen" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">SlotSync V2 is launching soon</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
            >
              The universal booking platform <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">for modern service businesses.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              Say goodbye to clunky software, mandatory client apps, and high fees. 
              Manage your schedule, staff, and payments in one beautifully crisp dashboard.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={scrollToWaitlist}
                className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full text-base font-bold hover:scale-105 transition-transform"
              >
                Get Early Access
              </button>
              <Link 
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                Sign in to Dashboard
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 3. 3D Interactive Services Scroll Showcase */}
        <section ref={targetRef} className="relative h-[300vh] bg-black">
          <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black" />
            
            <div className="relative z-10 text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">One platform. <br/> Built for your industry.</h2>
              <p className="text-gray-400">Keep scrolling to explore.</p>
            </div>

            {/* 3D Scene Container */}
            <div className="relative w-full max-w-lg perspective-1000">
              <motion.div 
                style={{
                  rotateX,
                  rotateY,
                  scale,
                  transformStyle: "preserve-3d"
                }}
                className="relative w-full aspect-square md:aspect-video rounded-3xl border border-white/10 bg-black shadow-[0_0_50px_rgba(99,91,255,0.2)] flex items-center justify-center overflow-hidden"
              >
                {/* Background glow of active service */}
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${SERVICES[activeIndex].color}`} />
                
                {/* Content */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.8, z: -100 }}
                    animate={{ opacity: 1, scale: 1, z: 50 }}
                    exit={{ opacity: 0, scale: 1.2, z: 100 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 transform-style-3d"
                    style={{ transform: "translateZ(50px)" }} // Pop out effect
                  >
                    {SERVICES[activeIndex].icon}
                    <h3 className="text-3xl font-bold text-white mb-4">{SERVICES[activeIndex].title}</h3>
                    <p className="text-gray-300 text-lg">{SERVICES[activeIndex].description}</p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Indicator Dots */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                {SERVICES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. USPs / Comparison Section */}
        <section className="py-32 px-6 bg-[#0b1326] relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-white mb-4">Why businesses switch to SlotSync</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Traditional booking apps are clunky, require your clients to download an app, and hold onto your money. We do things differently.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Client App Required</h3>
                <p className="text-gray-400">Clients book instantly through a beautiful web link. No passwords to remember, no mandatory app downloads. Frictionless conversion.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <CreditCard className="w-48 h-48" />
                </div>
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Direct Stripe Payouts</h3>
                <p className="text-gray-400 relative z-10">We don't hold your funds. With our Stripe Connect integration, money flows directly to your bank account instantly. Take deposits to eliminate no-shows.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Multi-Staff Mastery</h3>
                <p className="text-gray-400">Easily manage complex rosters. Staff get their own logins and schedules, while you get a bird's-eye view of your entire business operations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Pricing Section (3-Tier) */}
        <section className="py-32 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
              <p className="text-gray-400">Start for free. Upgrade when you need more power.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Starter */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-gray-400">/mo</span>
                </div>
                <p className="text-gray-400 text-sm mb-8 pb-8 border-b border-white/10">Perfect for solo professionals just getting started.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> 1 Staff Member</li>
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Up to 50 bookings/mo</li>
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Basic booking link</li>
                </ul>
                <button onClick={scrollToWaitlist} className="w-full py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors font-semibold">Start Free</button>
              </div>

              {/* Professional (Highlighted) */}
              <div className="bg-gradient-to-b from-primary/20 to-black border border-primary rounded-3xl p-8 relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(99,91,255,0.2)]">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Most Popular</div>
                <h3 className="text-xl font-semibold text-primary mb-2">Professional</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-white">$29</span>
                  <span className="text-gray-400">/mo</span>
                </div>
                <p className="text-gray-400 text-sm mb-8 pb-8 border-b border-white/10">Everything you need to run a modern service business.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-primary" /> Up to 5 Staff Members</li>
                  <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited Bookings</li>
                  <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-primary" /> Stripe Payment Processing</li>
                  <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-primary" /> Automated SMS Reminders</li>
                </ul>
                <button onClick={scrollToWaitlist} className="w-full py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors font-bold shadow-[0_0_15px_rgba(99,91,255,0.4)]">Get Early Access</button>
              </div>

              {/* Business */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Business</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-white">$79</span>
                  <span className="text-gray-400">/mo</span>
                </div>
                <p className="text-gray-400 text-sm mb-8 pb-8 border-b border-white/10">For large clinics, franchises, and high-volume salons.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Unlimited Staff</li>
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Advanced Analytics</li>
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Multi-location support</li>
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Priority Support</li>
                </ul>
                <button onClick={scrollToWaitlist} className="w-full py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors font-semibold">Join Waitlist</button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Waitlist Form Section */}
        <section id="waitlist" className="py-32 px-6 bg-[#0b1326] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Secure your spot</h2>
              <p className="text-gray-400">
                We're rolling out SlotSync to a limited number of businesses. Sign up now to lock in your pricing.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-[32px] p-8 border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4 text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold border border-green-500/30 mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">You're on the list!</h3>
                    <p className="text-gray-400">
                      Thank you for joining. We will email you with your early access invite as soon as your spot opens.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleFormSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 text-left"
                  >
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
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
                        className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="businessType" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Business Type
                        </label>
                        <select
                          id="businessType"
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          required
                          className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all appearance-none"
                        >
                          <option value="" disabled>Select type</option>
                          <option value="Hair Salon">Hair Salon</option>
                          <option value="Barber Shop">Barber Shop</option>
                          <option value="Nail Salon">Nail Salon</option>
                          <option value="Beauty / Spa">Beauty &amp; Spa</option>
                          <option value="Fitness / Personal Trainer">Fitness &amp; Trainer</option>
                          <option value="Medical / Clinic">Medical / Clinic</option>
                          <option value="Other">Other Service</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="country" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className="w-full h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all appearance-none"
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
                      className="w-full bg-white text-black py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      {isSubmitting ? "Joining..." : "Join Free Waitlist"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-6 w-full max-w-7xl mx-auto">
          <div className="text-center md:text-left">
            <div className="font-bold text-2xl text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="text-primary w-5 h-5" /> SlotSync
            </div>
            <div className="text-sm text-gray-500">© 2026 SlotSync. The universal booking platform.</div>
          </div>
          <div className="flex gap-8">
            <a className="text-sm text-gray-500 hover:text-white transition-colors" href="#">Privacy</a>
            <a className="text-sm text-gray-500 hover:text-white transition-colors" href="#">Terms</a>
            <a className="text-sm text-gray-500 hover:text-white transition-colors" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
