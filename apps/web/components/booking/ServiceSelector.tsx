"use client";

export function ServiceSelector() {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select a Service</label>
      <div className="space-y-2">
        <div className="rounded-lg border p-3 cursor-pointer hover:border-brand-400 transition-colors">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">Loading services...</p>
              <p className="text-xs text-muted-foreground">Configure services in your dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
