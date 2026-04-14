import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const days = 30;
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const downloads = await prisma.download.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true },
    });

    const byDay: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      byDay[key] = 0;
    }
    for (const dl of downloads) {
      const key = dl.createdAt.toISOString().slice(0, 10);
      if (key in byDay) byDay[key] += 1;
    }

    return NextResponse.json({
      activity: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
