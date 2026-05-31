import { Hono } from "hono";
import { prisma } from "../lib/db";
import { z } from "zod";

export const serviceRoutes = new Hono();

const serviceSchema = z.object({
  name: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  price: z.number().nonnegative(),
  description: z.string().optional(),
});

serviceRoutes.get("/", async (c) => {
  const userId = c.get("userId" as never);
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) return c.json({ error: "Business not found" }, 404);

  const services = await prisma.service.findMany({
    where: { businessId: business.id },
    orderBy: { name: "asc" },
  });
  return c.json(services);
});

serviceRoutes.post("/", async (c) => {
  const userId = c.get("userId" as never);
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) return c.json({ error: "Business not found" }, 404);

  const body = await c.req.json();
  const data = serviceSchema.parse(body);

  const service = await prisma.service.create({
    data: { ...data, businessId: business.id },
  });
  return c.json(service, 201);
});

serviceRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const service = await prisma.service.update({
    where: { id },
    data: body,
  });
  return c.json(service);
});

serviceRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.service.update({
    where: { id },
    data: { isActive: false },
  });
  return c.json({ message: "Service deactivated" });
});
