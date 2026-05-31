import { Hono } from "hono";
import { prisma } from "../lib/db";
import { z } from "zod";

export const bookingRoutes = new Hono();

const createBookingSchema = z.object({
  businessId: z.string().uuid(),
  serviceId: z.string().uuid(),
  staffId: z.string().uuid().optional(),
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

bookingRoutes.get("/", async (c) => {
  const userId = c.get("userId" as never);
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) return c.json({ error: "Business not found" }, 404);

  const { status, from, to } = c.req.query();
  const bookings = await prisma.booking.findMany({
    where: {
      businessId: business.id,
      ...(status && { status }),
      ...(from && to && {
        startTime: { gte: new Date(from), lte: new Date(to) },
      }),
    },
    include: { service: true, staff: true },
    orderBy: { startTime: "asc" },
  });
  return c.json(bookings);
});

bookingRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const data = createBookingSchema.parse(body);

  const booking = await prisma.booking.create({
    data: {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    },
    include: { service: true, staff: true },
  });
  return c.json(booking, 201);
});

bookingRoutes.patch("/:id/status", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
  });
  return c.json(booking);
});

bookingRoutes.get("/stats", async (c) => {
  const userId = c.get("userId" as never);
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) return c.json({ error: "Business not found" }, 404);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [total, todayCount, confirmed, cancelled] = await Promise.all([
    prisma.booking.count({ where: { businessId: business.id } }),
    prisma.booking.count({
      where: { businessId: business.id, startTime: { gte: today, lt: tomorrow } },
    }),
    prisma.booking.count({
      where: { businessId: business.id, status: "confirmed" },
    }),
    prisma.booking.count({
      where: { businessId: business.id, status: "cancelled" },
    }),
  ]);

  return c.json({ total, today: todayCount, confirmed, cancelled });
});
