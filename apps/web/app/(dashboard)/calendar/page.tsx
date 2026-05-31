import { CalendarView } from "@/components/dashboard/CalendarView";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View and manage your schedule at a glance.
        </p>
      </div>
      <CalendarView />
    </div>
  );
}
