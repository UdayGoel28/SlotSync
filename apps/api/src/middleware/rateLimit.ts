import { createMiddleware } from "hono/factory";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // per window

export const rateLimiter = () =>
  createMiddleware(async (c, next) => {
    const ip = c.req.header("x-forwarded-for") || "unknown";
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
      await next();
      return;
    }

    if (record.count >= MAX_REQUESTS) {
      return c.json({ error: "Too many requests" }, 429);
    }

    record.count++;
    await next();
  });
