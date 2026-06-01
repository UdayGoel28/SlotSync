import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] font-sans antialiased text-slate-800">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl flex h-16 items-center justify-between mx-auto px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-amber-300 flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SlotSync
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 rounded-full px-2 py-1.5">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-1.5 rounded-full hover:bg-white">
              Features
            </a>
            <a href="#why-us" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-1.5 rounded-full hover:bg-white">
              Why Us
            </a>
            <a href="#services" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-1.5 rounded-full hover:bg-white">
              Services
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-1.5 rounded-full hover:bg-white">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link
              href="#waitlist"
              className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95"
            >
              Get Early Access
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400 to-amber-300 flex items-center justify-center text-white font-bold text-xs">S</div>
                <span className="text-lg font-bold text-slate-900">SlotSync</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs">The universal booking platform for modern service businesses.</p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Product</h4>
                <a href="#features" className="block text-slate-500 hover:text-slate-900 transition-colors">Features</a>
                <a href="#pricing" className="block text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
                <a href="#services" className="block text-slate-500 hover:text-slate-900 transition-colors">Services</a>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Company</h4>
                <a href="#" className="block text-slate-500 hover:text-slate-900 transition-colors">Privacy</a>
                <a href="#" className="block text-slate-500 hover:text-slate-900 transition-colors">Terms</a>
                <a href="#" className="block text-slate-500 hover:text-slate-900 transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} SlotSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
