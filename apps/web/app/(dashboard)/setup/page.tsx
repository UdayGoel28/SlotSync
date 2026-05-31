import { EmptyState } from "@/components/shared/EmptyState";

export default function SetupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Booking Page Setup</h1>
        <p className="text-muted-foreground">
          Customize your public booking page and share it with clients.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Page Preview */}
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold">Preview</h2>
          <div className="aspect-[9/16] rounded-lg bg-gray-100 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Your booking page preview will appear here
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-xl border bg-white p-6 space-y-6">
          <h2 className="font-semibold">Settings</h2>
          <EmptyState
            title="Configure your booking page"
            description="Add services and staff members to set up your booking page."
            icon="settings"
          />
        </div>
      </div>
    </div>
  );
}
