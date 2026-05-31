import { createMiddleware } from "hono/factory";

export const authMiddleware = () =>
  createMiddleware(async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify Supabase JWT
      // In production, verify the JWT against Supabase's JWKS endpoint
      // For now, decode the payload to extract the user ID
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      if (!payload.sub) {
        return c.json({ error: "Invalid token" }, 401);
      }

      c.set("userId" as never, payload.sub as never);
      await next();
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  });
