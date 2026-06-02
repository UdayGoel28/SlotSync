import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col grain-overlay">
      {/* Gradient mesh background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-100 via-cream-50 to-cream-100" />
        {/* Subtle blush accent in top-right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-coral-50/60 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        {/* Subtle sage accent in bottom-left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage-100/80 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <nav className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-coral-200 to-coral-400 flex items-center justify-center text-white font-display text-lg font-semibold">
                S
              </div>
              <span className="text-lg font-display font-semibold text-[#2C2C2C] tracking-wide">
                SlotSync
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <a href="#features" className="text-sm text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors px-4 py-2 rounded-xl hover:bg-white/40">
                Features
              </a>
              <a href="#why-us" className="text-sm text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors px-4 py-2 rounded-xl hover:bg-white/40">
                Why Us
              </a>
              <a href="#services" className="text-sm text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors px-4 py-2 rounded-xl hover:bg-white/40">
                Services
              </a>
              <a href="#pricing" className="text-sm text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors px-4 py-2 rounded-xl hover:bg-white/40">
                Pricing
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-[#2C2C2C]/70 hover:text-[#2C2C2C] transition-colors hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-[#D4846A] hover:bg-[#C07558] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-coral-200/40 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-sage-200/50 py-16 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-coral-200 to-coral-400 flex items-center justify-center text-white font-display text-sm font-semibold">S</div>
                <span className="text-lg font-display font-semibold text-[#2C2C2C]">SlotSync</span>
              </div>
              <p className="text-sm text-[#2C2C2C]/50 max-w-xs leading-relaxed">
                The universal booking platform for modern service businesses.
              </p>
            </div>
            <div className="flex gap-16 text-sm">
              <div className="space-y-3">
                <h4 className="font-medium text-[#2C2C2C]">Product</h4>
                <a href="#features" className="block text-[#2C2C2C]/50 hover:text-[#D4846A] transition-colors">Features</a>
                <a href="#pricing" className="block text-[#2C2C2C]/50 hover:text-[#D4846A] transition-colors">Pricing</a>
                <a href="#services" className="block text-[#2C2C2C]/50 hover:text-[#D4846A] transition-colors">Services</a>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-[#2C2C2C]">Company</h4>
                <a href="#" className="block text-[#2C2C2C]/50 hover:text-[#D4846A] transition-colors">Privacy</a>
                <a href="#" className="block text-[#2C2C2C]/50 hover:text-[#D4846A] transition-colors">Terms</a>
                <a href="#" className="block text-[#2C2C2C]/50 hover:text-[#D4846A] transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-sage-200/30">
            <p className="text-xs text-[#2C2C2C]/30 text-center">© {new Date().getFullYear()} SlotSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
