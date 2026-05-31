export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your business settings, integrations, and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Business Info */}
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold">Business Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Business Name</label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Your Business"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="e.g., Hair Salon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Timezone</label>
              <select className="w-full rounded-lg border px-3 py-2 text-sm">
                <option>America/New_York</option>
                <option>America/Chicago</option>
                <option>America/Denver</option>
                <option>America/Los_Angeles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Country</label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold">Booking Settings</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Buffer Time (minutes)</label>
              <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" defaultValue={0} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Booking Window (days)</label>
              <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" defaultValue={30} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Cancellation Window (hours)</label>
              <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" defaultValue={24} />
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold">Integrations</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <p className="font-medium text-sm">Stripe</p>
                <p className="text-xs text-muted-foreground">Accept payments</p>
              </div>
              <button className="text-sm font-medium text-brand-600 hover:underline">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <p className="font-medium text-sm">Google Business</p>
                <p className="text-xs text-muted-foreground">Collect reviews</p>
              </div>
              <button className="text-sm font-medium text-brand-600 hover:underline">
                Connect
              </button>
            </div>
          </div>
        </div>

        <button className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
