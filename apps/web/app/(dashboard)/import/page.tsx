import { EmptyState } from "@/components/shared/EmptyState";

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import Data</h1>
        <p className="text-muted-foreground">
          Import your existing clients and booking history from other platforms.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-8">
        <EmptyState
          title="Import your data"
          description="Upload a CSV file with your clients, services, or booking history to get started quickly."
          icon="upload"
        />

        <div className="mt-6 flex justify-center">
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 hover:border-brand-400 transition-colors">
            <span className="text-sm font-medium text-muted-foreground">
              Drop your CSV file here or click to browse
            </span>
            <input type="file" accept=".csv" className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
