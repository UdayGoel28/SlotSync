import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { authRoutes } from "./routes/auth";
import { businessRoutes } from "./routes/businesses";
import { bookingRoutes } from "./routes/bookings";
import { serviceRoutes } from "./routes/services";
import { staffRoutes } from "./routes/staff";
import { clientRoutes } from "./routes/clients";
import { paymentRoutes } from "./routes/payments";
import { reviewRoutes } from "./routes/reviews";
import { authMiddleware } from "./middleware/auth";
import { axiomLogger } from "./middleware/logger";
import { rateLimiter } from "./middleware/rateLimit";

const app = new Hono();

// Global middleware
app.use("*", logger());
app.use("*", axiomLogger());
app.use(
  "*",
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use("*", rateLimiter());

// Health check
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// Public routes
app.route("/auth", authRoutes);

// Protected routes
app.use("/api/*", authMiddleware());
app.route("/api/businesses", businessRoutes);
app.route("/api/bookings", bookingRoutes);
app.route("/api/services", serviceRoutes);
app.route("/api/staff", staffRoutes);
app.route("/api/clients", clientRoutes);
app.route("/api/payments", paymentRoutes);
app.route("/api/reviews", reviewRoutes);

const port = parseInt(process.env.PORT || "3001", 10);

console.log(`🚀 SlotSync API running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
