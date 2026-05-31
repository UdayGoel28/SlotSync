import { EmptyState } from "@/components/shared/EmptyState";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground">
          Manage Google reviews and feedback from your clients.
        </p>
      </div>

      <EmptyState
        title="No reviews yet"
        description="Connect your Google Business Profile to start collecting reviews after appointments."
        icon="star"
      />
    </div>
  );
}
