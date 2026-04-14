import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSupervisorOrAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireSupervisorOrAdmin(req);
    const isAdmin = user.role === "ADMIN";
    const sid = user.id;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const pendingWorks = await prisma.work.findMany({
      where: {
        deletedAt: null,
        status: "PENDING",
        ...(isAdmin ? {} : { supervisorId: sid }),
      },
      include: { author: true },
    });

    const pendingCount = pendingWorks.length;

    const reviewsMonth = await prisma.review.findMany({
      where: {
        createdAt: { gte: monthStart },
        ...(isAdmin ? {} : { reviewerId: sid }),
      },
    });
    const reviewedThisMonth = reviewsMonth.length;
    const avgScore =
      reviewsMonth.length > 0 ?
        Math.round(
          (reviewsMonth.reduce((s, r) => s + r.overallScore, 0) / reviewsMonth.length) * 10
        ) / 10
      : null;

    const studentsCount = await prisma.work.groupBy({
      by: ["authorId"],
      where: {
        deletedAt: null,
        ...(isAdmin ? {} : { supervisorId: sid }),
      },
      _count: true,
    }).then((g) => g.length);

    const urgentWorks = pendingWorks
      .map((w) => ({
        id: w.id,
        title: w.title,
        studentName: w.author.name,
        daysWaiting: Math.floor((now.getTime() - w.createdAt.getTime()) / 86400000),
      }))
      .filter((u) => u.daysWaiting >= 7)
      .slice(0, 10);

    const recentReviews = await prisma.review.findMany({
      where: isAdmin ? {} : { reviewerId: sid },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { work: { include: { author: true } } },
    });

    const activityLast30Days: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const next = new Date(day.getTime() + 86400000);
      const count = await prisma.review.count({
        where: {
          createdAt: { gte: day, lt: next },
          ...(isAdmin ? {} : { reviewerId: sid }),
        },
      });
      activityLast30Days.push({ date: day.toISOString().slice(0, 10), count });
    }

    return NextResponse.json({
      pendingCount,
      reviewedThisMonth,
      avgScore,
      studentsCount,
      urgentWorks,
      recentReviews: recentReviews.map((r) => ({
        id: r.id,
        studentName: r.work.author.name,
        title: r.work.title,
        score: r.overallScore,
        decision: r.decision,
        createdAt: r.createdAt.toISOString(),
      })),
      activityLast30Days,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
