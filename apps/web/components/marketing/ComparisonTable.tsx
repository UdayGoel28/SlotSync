const features = [
  "Online Booking Page",
  "Automated Reminders (SMS + Email)",
  "Stripe Payments",
  "Client Management",
  "Team/Staff Management",
  "Google Review Requests",
  "Working Hours & Buffers",
  "No-show Fees & Deposits",
  "Analytics Dashboard",
  "CSV Import",
];

export function ComparisonTable() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            How SlotSync compares
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            More features, better pricing, built for modern businesses.
          </p>
        </div>

        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Feature</th>
                <th className="text-center py-3 px-4 font-bold text-brand-600">SlotSync</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Calendly</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Acuity</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature} className="border-b">
                  <td className="py-3 px-4">{feature}</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">
                    {Math.random() > 0.3 ? "✅" : "❌"}
                  </td>
                  <td className="text-center py-3 px-4">
                    {Math.random() > 0.4 ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
