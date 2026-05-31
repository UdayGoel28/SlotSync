import { createMiddleware } from "hono/factory";

export const axiomLogger = () =>
  createMiddleware(async (c, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    const logData = {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration,
      timestamp: new Date().toISOString(),
    };

    // In production, send to Axiom
    if (process.env.AXIOM_TOKEN) {
      try {
        fetch(`https://api.axiom.co/v1/datasets/${process.env.AXIOM_DATASET}/ingest`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.AXIOM_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([logData]),
        }).catch(() => {}); // Fire and forget
      } catch {
        // Silently fail — logging should not break the app
      }
    }
  });
