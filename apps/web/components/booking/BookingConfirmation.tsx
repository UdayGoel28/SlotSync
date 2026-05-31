export function BookingConfirmation() {
  return (
    <div className="text-center space-y-4 py-8">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <span className="text-3xl">✓</span>
      </div>
      <h2 className="text-xl font-bold">Booking Confirmed!</h2>
      <p className="text-muted-foreground">
        You&apos;ll receive a confirmation email shortly with all the details.
      </p>
    </div>
  );
}
