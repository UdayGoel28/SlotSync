"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden grain-overlay">
      {/* Gradient mesh background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-100 via-cream-50 to-cream-100" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coral-50/50 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sage-100/60 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-coral-100/30 rounded-full blur-[60px]" />
      </div>

      <div className="w-full max-w-md px-6 space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-200 to-coral-400 flex items-center justify-center text-white font-display text-xl font-semibold">
              S
            </div>
            <span className="text-2xl font-display font-semibold text-[#2C2C2C] tracking-wide">
              SlotSync
            </span>
          </Link>
          <h1 className="font-display text-3xl font-light text-[#2C2C2C] mb-2">Create your account</h1>
          <p className="text-sm text-[#2C2C2C]/40">
            Start managing your bookings in minutes
          </p>
        </div>

        {/* Glass card form */}
        <form onSubmit={handleSignup} className="glass-card rounded-2xl p-8 space-y-5 shadow-xl shadow-sage-200/20">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-[#2C2C2C]/40 uppercase tracking-wider mb-1.5">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName((e.target as HTMLInputElement).value)}
              className="w-full h-12 rounded-xl bg-white/50 border border-sage-200/50 px-4 text-[#2C2C2C] text-sm focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-coral-100 transition-all placeholder:text-[#2C2C2C]/25"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[#2C2C2C]/40 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              className="w-full h-12 rounded-xl bg-white/50 border border-sage-200/50 px-4 text-[#2C2C2C] text-sm focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-coral-100 transition-all placeholder:text-[#2C2C2C]/25"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-[#2C2C2C]/40 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
              className="w-full h-12 rounded-xl bg-white/50 border border-sage-200/50 px-4 text-[#2C2C2C] text-sm focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-coral-100 transition-all placeholder:text-[#2C2C2C]/25"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4846A] hover:bg-[#C07558] text-white py-3.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-coral-200/30 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#2C2C2C]/40">
          Already have an account?{" "}
          <Link href="/login" className="text-[#D4846A] hover:text-[#C07558] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
