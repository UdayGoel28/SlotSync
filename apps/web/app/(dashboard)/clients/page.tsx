import { EmptyState } from "@/components/shared/EmptyState";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client database and booking history.
          </p>
        </div>
      </div>

      <EmptyState
        title="No clients yet"
        description="Clients will appear here once they book an appointment."
        icon="users"
      />
    </div>
  );
}
