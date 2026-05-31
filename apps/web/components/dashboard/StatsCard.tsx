interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  change?: string;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  const icons: Record<string, string> = {
    "calendar": "📅",
    "trending-up": "📈",
    "dollar-sign": "💰",
    "users": "👥",
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="text-xl">{icons[icon] || "📊"}</span>
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
