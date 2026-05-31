import { Hono } from "hono";

export const reviewRoutes = new Hono();

reviewRoutes.get("/", async (c) => {
  // TODO: Implement Google Places reviews integration
  return c.json({ reviews: [], message: "Reviews integration pending" });
});

reviewRoutes.post("/request", async (c) => {
  const { bookingId } = await c.req.json();
  // TODO: Send review request via email/SMS after booking completion
  return c.json({ message: "Review request sent", bookingId });
});
