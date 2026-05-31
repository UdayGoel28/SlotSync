import { Hono } from "hono";

export const authRoutes = new Hono();

authRoutes.post("/callback", async (c) => {
  // Handle Supabase auth callback
  return c.json({ message: "Auth callback processed" });
});

authRoutes.post("/logout", async (c) => {
  return c.json({ message: "Logged out" });
});
