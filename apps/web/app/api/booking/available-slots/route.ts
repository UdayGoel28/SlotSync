import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@slotsync/database";
import { startOfDay, endOfDay, format, addMinutes, isBefore, isEqual } from "date-fns";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");
  const dateStr = searchParams.get("date"); // "YYYY-MM-DD"
  const serviceId = searchParams.get("serviceId");

  if (!businessId || !dateStr || !serviceId) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  // Parse date
  const [year, month, day] = dateStr.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day);

  // Get working hours for this day of week
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[targetDate.getDay()];
  const workingHours = business.workingHours as Record<string, any>;
  const dayConfig = workingHours?.[dayName];

  if (!dayConfig || !dayConfig.active) {
    return NextResponse.json({ slots: [], closed: true });
  }

  // Parse open/close times
  const [openH, openM] = dayConfig.start.split(":").map(Number);
  const [closeH, closeM] = dayConfig.end.split(":").map(Number);

  const dayStart = new Date(year, month - 1, day, openH, openM, 0, 0);
  const dayEnd = new Date(year, month - 1, day, closeH, closeM, 0, 0);

  const duration = service.durationMinutes;
  const buffer = business.bufferMinutes || 0;

  // Fetch existing bookings on this date
  const existingBookings = await prisma.booking.findMany({
    where: {
      businessId,
      status: { not: "cancelled" },
      startTime: { gte: startOfDay(targetDate), lte: endOfDay(targetDate) },
    },
    select: { startTime: true, endTime: true },
  });

  // Generate all possible slots
  const slots: { start: string; end: string; startTime: string; endTime: string; display: string }[] = [];
  let cursor = new Date(dayStart);

  while (true) {
    const slotEnd = addMinutes(cursor, duration);

    // Slot must end before or at closing time
    if (isBefore(dayEnd, slotEnd) && !isEqual(dayEnd, slotEnd)) break;

    // Check overlap with existing bookings
    const overlaps = existingBookings.some((b) => {
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);
      return cursor < bEnd && slotEnd > bStart;
    });

    if (!overlaps) {
      const startH = cursor.getHours();
      const startM = cursor.getMinutes();
      const endH = slotEnd.getHours();
      const endM = slotEnd.getMinutes();

      const formatTime = (h: number, m: number) => {
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
        return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
      };

      slots.push({
        start: `${startH.toString().padStart(2, "0")}:${startM.toString().padStart(2, "0")}`,
        end: `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`,
        startTime: cursor.toISOString(),
        endTime: slotEnd.toISOString(),
        display: `${formatTime(startH, startM)} — ${formatTime(endH, endM)} (${duration} mins)`,
      });
    }

    // Advance cursor by duration + buffer
    cursor = addMinutes(cursor, duration + buffer);
  }

  return NextResponse.json({ slots, closed: false });
}
