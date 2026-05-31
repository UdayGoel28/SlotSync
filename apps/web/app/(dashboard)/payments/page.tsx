import { EmptyState } from "@/components/shared/EmptyState";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Track payments and manage your Stripe account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">$0.00</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-medium text-muted-foreground">This Month</p>
          <p className="text-3xl font-bold mt-1">$0.00</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm font-medium text-muted-foreground">Pending</p>
          <p className="text-3xl font-bold mt-1">$0.00</p>
        </div>
      </div>

      <EmptyState
        title="No payments yet"
        description="Connect Stripe to start accepting payments from your clients."
        icon="credit-card"
      />
    </div>
  );
}
