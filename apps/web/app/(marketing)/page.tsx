"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { joinWaitlist } from "@/app/actions";
import Link from "next/link";

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

  const scrollToWaitlist = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    const waitlistSection = document.getElementById("waitlist");
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md selection:bg-primary selection:text-on-primary min-h-screen">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-glass backdrop-blur-xl border-b border-glass-border shadow-sm">
        <nav className="flex justify-between items-center px-gutter py-4 w-full max-w-container-max mx-auto">
          <div className="font-headline-md text-headline-lg-mobile font-bold text-primary dark:text-primary">
            SlotSync
          </div>
          <div className="flex items-center gap-sm">
            <Link href="/login" className="text-on-surface hover:text-primary font-label-md uppercase tracking-wider transition-colors mr-4 hidden md:block">
              Login
            </Link>
            <button 
              onClick={scrollToWaitlist}
              className="bg-primary-container text-on-primary-container px-sm py-2 rounded-full font-label-md text-label-md uppercase tracking-wider shadow-[0_0_20px_rgba(99,91,255,0.3)] hover:shadow-[0_0_30px_rgba(99,91,255,0.5)] hover:scale-105 transition-all"
            >
              Sign up
            </button>
          </div>
        </nav>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col justify-end pt-32 overflow-hidden">
          {/* Background Image with Fade */}
          <div className="absolute inset-0 z-0">
            <img alt="Professional at work" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd--G7hm0afFY2n5UtVUZ3Fvd-gBkS2s8WgsTUqQzCC7hGmZZnlnLp3GSpcwokdk_XSmd1ehN2b6m68i3Tus4GuLbfZ-CjDhs-WhKCiYUUpEhtQcCMGFp53Os_cdSdRdo_X144bwtSy-XIVmKx1FPf_QknijUuD0pHnsAmlKrT6sca6GNmaf9cABwpDkLrHhl54sDbW101zrq65LJttpd2qGO7CnV-NNxnyXj43imGHjdvoGigULGmaZvFL2PaZlyoVOsNIpFZ20I"/>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface/80 via-transparent to-transparent"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 px-gutter pb-xl w-full max-w-container-max mx-auto">
            <div className="flex flex-col lg:flex-row items-end gap-lg">
              <div className="lg:w-1/2 space-y-sm">
                <h1 className="font-display-xl text-[48px] md:text-[64px] leading-[1.1] tracking-[-0.04em] text-on-surface font-bold">
                  Built for fast-moving service businesses.
                </h1>
                <p className="font-body-lg text-[18px] text-on-surface-variant max-w-[480px]">
                  The all-in-one booking platform for modern salons and clinics. No app required.
                </p>
                <div className="pt-4">
                  <button 
                    onClick={scrollToWaitlist}
                    className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label-md text-label-md uppercase tracking-wider shadow-[0_0_20px_rgba(99,91,255,0.3)] hover:shadow-[0_0_30px_rgba(99,91,255,0.5)] hover:scale-105 transition-all"
                  >
                    Get Early Access
                  </button>
                </div>
              </div>
              
              {/* Floating Mockup Card */}
              <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
                <div className="relative group perspective-1000">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative bg-white rounded-[28px] p-2 shadow-2xl w-full max-w-[320px] shadow-[0_0_40px_-5px_rgba(99,91,255,0.15)] transform rotate-3 hover:rotate-0 transition-transform duration-500 hover:scale-105">
                    <img alt="SlotSync App Mockup" className="rounded-[22px] w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsTW51BwZRwlb-IczUm1Mjue4jDeiLppynCPPJ0ZsZzYXlYQCiEJtOfdlzA8lhGcQPiNvZH4zr1Pe1sR81qXddiyYrYu0chhK-0ODxI77OjrNTWE1MZafa_i2mBAEM2qaSXVnOGgbcVRicUxszRAfohTqUGbfXp1G1qUxMtSHLz0X40hGk348n9DvHXJwaTegRu289G_EjNNsYO5XmqNqLpDFtBuGLVIwX4qGlMpmzQxbvcvCuzHAKNwrBpnwMtr9Voy6Yuk3ExYo"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-xl px-gutter max-w-container-max mx-auto mt-12">
          <div className="text-center mb-xl">
            <span className="text-primary font-label-md text-[12px] font-semibold uppercase tracking-[0.2em] mb-xs block">Capabilities</span>
            <h2 className="font-headline-lg text-[32px] font-semibold text-on-surface tracking-[-0.02em]">Streamline your workflow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-sm md:gap-lg">
            {/* Feature 1 */}
            <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] border border-glass-border p-lg rounded-[32px] group hover:bg-surface-container-high transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-sm text-primary group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
              </div>
              <h3 className="font-headline-md text-[24px] font-semibold text-on-surface mb-xs">Automated Reminders</h3>
              <p className="font-body-md text-[16px] text-on-surface-variant">Reduce no-shows by 40% with smart SMS and email notifications that keep clients on track.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] border border-glass-border p-lg rounded-[32px] group hover:bg-surface-container-high transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-sm text-primary group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
              </div>
              <h3 className="font-headline-md text-[24px] font-semibold text-on-surface mb-xs">Custom Booking Links</h3>
              <p className="font-body-md text-[16px] text-on-surface-variant">Share your availability anywhere. Social media, your website, or direct message links for instant conversion.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] border border-glass-border p-lg rounded-[32px] group hover:bg-surface-container-high transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-sm text-primary group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              </div>
              <h3 className="font-headline-md text-[24px] font-semibold text-on-surface mb-xs">Team Management</h3>
              <p className="font-body-md text-[16px] text-on-surface-variant">Sync multiple staff calendars, set individual permissions, and track performance across your entire clinic.</p>
            </div>
          </div>
        </section>

        {/* Waitlist Section replacing Pricing */}
        <section id="waitlist" className="py-xl px-gutter relative overflow-hidden mt-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-container-max mx-auto text-center mb-xl">
            <span className="text-primary font-label-md text-[12px] font-semibold uppercase tracking-[0.2em] mb-xs block">Early Access</span>
            <h2 className="font-headline-lg text-[32px] font-semibold text-on-surface mb-sm">Secure your spot on the waitlist</h2>
            <p className="font-body-lg text-[18px] text-on-surface-variant max-w-md mx-auto">
              We're rolling out SlotSync to a limited number of service businesses. Sign up now to lock in 3 months free when we launch in your area.
            </p>
          </div>
          
          <div className="max-w-xl mx-auto relative z-10">
            <div className="bg-surface-container-highest rounded-[32px] p-lg border border-primary/30 shadow-[0_0_40px_-5px_rgba(99,91,255,0.15)] relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4 text-center py-8"
                  >
                    <div className="w-16 h-16 bg-success-vibrant/20 text-success-vibrant rounded-full flex items-center justify-center mx-auto text-3xl font-bold border border-success-vibrant/30">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    </div>
                    <h3 className="text-[24px] font-semibold font-headline-md text-on-surface">You're on the list!</h3>
                    <p className="text-on-surface-variant text-[16px]">
                      Thank you for joining. We will email you with your early access invite as soon as we open in your city.
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
                      <div className="bg-error/10 border border-error/20 rounded-xl p-3 text-error text-[14px] font-semibold">
                        {error}
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
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
                        className="w-full h-12 bg-surface border border-outline-variant rounded-xl px-4 text-[16px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-text-muted"
                      />
                    </div>

                    {/* Business Type & Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="businessType" className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                          Business Type
                        </label>
                        <select
                          id="businessType"
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          required
                          className="w-full h-12 bg-surface border border-outline-variant rounded-xl px-4 text-[16px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all appearance-none"
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

                      <div className="space-y-2">
                        <label htmlFor="country" className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className="w-full h-12 bg-surface border border-outline-variant rounded-xl px-4 text-[16px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all appearance-none"
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
                      className="w-full bg-primary-container text-on-primary-container py-4 rounded-full font-label-md text-[14px] font-semibold uppercase tracking-widest shadow-[0_0_20px_rgba(99,91,255,0.3)] hover:shadow-[0_0_30px_rgba(99,91,255,0.5)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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
      <footer className="bg-surface-container-lowest border-t border-glass-border py-xl mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter gap-sm w-full max-w-container-max mx-auto">
          <div className="mb-sm md:mb-0 text-center md:text-left">
            <div className="font-headline-md text-[24px] font-semibold text-primary mb-2">SlotSync</div>
            <div className="font-label-md text-[14px] text-surface-tint">© 2026 SlotSync. Precision in every slot.</div>
          </div>
          <div className="flex gap-lg">
            <a className="font-label-md text-[14px] text-text-muted hover:text-primary transition-colors cursor-pointer" href="#">Privacy Policy</a>
            <a className="font-label-md text-[14px] text-text-muted hover:text-primary transition-colors cursor-pointer" href="#">Terms of Service</a>
            <a className="font-label-md text-[14px] text-text-muted hover:text-primary transition-colors cursor-pointer" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
