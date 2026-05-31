import { cn } from "@/lib/utils";

interface BookingCardProps {
  clientName: string;
  serviceName: string;
  time: string;
  status: string;
  staffName?: string;
}

export function BookingCard({ clientName, serviceName, time, status }: BookingCardProps) {
  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    "no-show": "bg-gray-100 text-gray-700",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
          <span className="text-sm font-bold text-brand-600">
            {clientName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-sm">{clientName}</p>
          <p className="text-xs text-muted-foreground">{serviceName}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {time && <span className="text-sm text-muted-foreground">{time}</span>}
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            statusColors[status] || statusColors.confirmed
          )}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
