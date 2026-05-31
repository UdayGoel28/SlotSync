import { Hono } from "hono";
import { prisma } from "../lib/db";

export const clientRoutes = new Hono();

clientRoutes.get("/", async (c) => {
  const userId = c.get("userId" as never);
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) return c.json({ error: "Business not found" }, 404);

  // Get unique clients from bookings
  const bookings = await prisma.booking.findMany({
    where: { businessId: business.id },
    select: {
      clientName: true,
      clientEmail: true,
      clientPhone: true,
      createdAt: true,
    },
    distinct: ["clientEmail"],
    orderBy: { createdAt: "desc" },
  });

  return c.json(bookings);
});

clientRoutes.get("/:email/bookings", async (c) => {
  const userId = c.get("userId" as never);
  const email = c.req.param("email");
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) return c.json({ error: "Business not found" }, 404);

  const bookings = await prisma.booking.findMany({
    where: { businessId: business.id, clientEmail: email },
    include: { service: true, staff: true },
    orderBy: { startTime: "desc" },
  });

  return c.json(bookings);
});
