import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalWorks, totalUsers, totalDownloads, pending, uploadedToday] = await prisma.$transaction([
      prisma.work.count({ where: { deletedAt: null } }),
      prisma.user.count(),
      prisma.download.count(),
      prisma.work.count({ where: { deletedAt: null, status: "PENDING" } }),
      prisma.work.count({
        where: { deletedAt: null, createdAt: { gte: startOfDay } },
      }),
    ]);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyDownloads = await prisma.download.count({
      where: { createdAt: { gte: monthStart } },
    });

    return NextResponse.json({
      totalWorks,
      totalUsers,
      totalDownloads,
      pending,
      uploadedToday,
      monthlyDownloads,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
