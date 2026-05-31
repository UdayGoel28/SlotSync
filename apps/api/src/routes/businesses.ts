import { Hono } from "hono";
import { prisma } from "../lib/db";
import { z } from "zod";

export const businessRoutes = new Hono();

const createBusinessSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  timezone: z.string(),
  country: z.string(),
  description: z.string().optional(),
  workingHours: z.record(z.any()),
});

businessRoutes.get("/", async (c) => {
  const userId = c.get("userId" as never);
  const business = await prisma.business.findUnique({
    where: { userId },
    include: { staff: true, services: true },
  });
  return c.json(business);
});

businessRoutes.post("/", async (c) => {
  const userId = c.get("userId" as never);
  const body = await c.req.json();
  const data = createBusinessSchema.parse(body);

  const business = await prisma.business.create({
    data: { ...data, userId },
  });
  return c.json(business, 201);
});

businessRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const business = await prisma.business.update({
    where: { id },
    data: body,
  });
  return c.json(business);
});

// Public: Get business by slug for booking page
businessRoutes.get("/slug/:slug", async (c) => {
  const slug = c.req.param("slug");
  const business = await prisma.business.findUnique({
    where: { slug },
    include: { services: { where: { isActive: true } }, staff: { where: { isActive: true } } },
  });

  if (!business) return c.json({ error: "Business not found" }, 404);
  return c.json(business);
});
