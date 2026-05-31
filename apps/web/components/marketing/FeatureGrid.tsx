const features = [
  {
    icon: "📅",
    title: "Smart Scheduling",
    description: "Automated booking with buffer times, working hours, and real-time availability.",
  },
  {
    icon: "💳",
    title: "Payments & Deposits",
    description: "Accept payments via Stripe with deposits, no-show fees, and automatic invoicing.",
  },
  {
    icon: "🔔",
    title: "Automated Reminders",
    description: "Reduce no-shows with SMS and email reminders sent 24hrs and 2hrs before appointments.",
  },
  {
    icon: "⭐",
    title: "Review Collection",
    description: "Automatically request Google reviews after completed appointments.",
  },
  {
    icon: "👥",
    title: "Client Management",
    description: "Build your client database with booking history, preferences, and contact details.",
  },
  {
    icon: "📊",
    title: "Business Analytics",
    description: "Track revenue, bookings, no-shows, and client retention with beautiful dashboards.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to run your business
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From booking to payments to client management — SlotSync handles it all.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border p-6 bg-white hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
