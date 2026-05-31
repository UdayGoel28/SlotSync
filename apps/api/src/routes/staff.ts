import { Hono } from "hono";
import { prisma } from "../lib/db";
import { z } from "zod";

export const staffRoutes = new Hono();

const staffSchema = z.object({
  name: z.string().min(1),
  photoUrl: z.string().url().optional(),
  workingHours: z.record(z.any()),
});

staffRoutes.get("/", async (c) => {
  const userId = c.get("userId" as never);
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) return c.json({ error: "Business not found" }, 404);

  const staff = await prisma.staff.findMany({
    where: { businessId: business.id },
    orderBy: { name: "asc" },
  });
  return c.json(staff);
});

staffRoutes.post("/", async (c) => {
  const userId = c.get("userId" as never);
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) return c.json({ error: "Business not found" }, 404);

  const body = await c.req.json();
  const data = staffSchema.parse(body);

  const member = await prisma.staff.create({
    data: { ...data, businessId: business.id },
  });
  return c.json(member, 201);
});

staffRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const member = await prisma.staff.update({
    where: { id },
    data: body,
  });
  return c.json(member);
});

staffRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.staff.update({
    where: { id },
    data: { isActive: false },
  });
  return c.json({ message: "Staff member deactivated" });
});
