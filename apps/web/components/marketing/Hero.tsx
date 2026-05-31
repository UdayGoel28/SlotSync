import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-100" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-300 rounded-full blur-3xl opacity-20" />

      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 mb-6">
          ✨ Now in Early Access
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
          Smart Booking for{" "}
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            Modern Businesses
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          The all-in-one platform that helps service businesses manage appointments,
          payments, and client relationships — effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-600 px-8 text-sm font-medium text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/30"
          >
            Start Free Trial
          </Link>
          <Link
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-lg border px-8 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            See Features →
          </Link>
        </div>
      </div>
    </section>
  );
}
