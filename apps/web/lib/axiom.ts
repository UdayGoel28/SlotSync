// Axiom logging client
// Configure in production with AXIOM_DATASET and AXIOM_TOKEN

export function log(message: string, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[SlotSync] ${message}`, data);
    return;
  }

  // In production, send to Axiom
  if (process.env.AXIOM_TOKEN) {
    fetch(
      `https://api.axiom.co/v1/datasets/${process.env.AXIOM_DATASET}/ingest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AXIOM_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ message, ...data, _time: new Date().toISOString() }]),
      }
    ).catch(() => {});
  }
}
