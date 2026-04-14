import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const facultyId = req.nextUrl.searchParams.get("facultyId") || undefined;
    const year = req.nextUrl.searchParams.get("year");

    const reviewed = await prisma.review.count();
    const avgAll = await prisma.review.aggregate({ _avg: { overallScore: true } });
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonth = await prisma.review.count({ where: { createdAt: { gte: monthStart } } });

    const workWhere = {
      deletedAt: null,
      status: "APPROVED" as const,
      ...(facultyId ? { department: { facultyId } } : {}),
      ...(year ? { year: Number(year) } : {}),
    };

    const topWorks = await prisma.work.findMany({
      where: workWhere,
      include: {
        reviews: true,
        author: true,
        department: { include: { faculty: true } },
        downloads: true,
      },
      take: 50,
    });

    const ranked = topWorks
      .map((w) => {
        const scores = w.reviews.map((r) => r.overallScore);
        const avg =
          scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        return {
          id: w.id,
          title: w.title,
          authorName: w.author.name,
          facultyName: w.department.faculty.name,
          score: Math.round(avg * 10) / 10,
          downloads: w.downloads.length,
        };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    const supervisors = await prisma.user.findMany({
      where: { role: "SUPERVISOR" },
      select: { id: true, name: true },
    });

    const reviewerWorkload = await Promise.all(
      supervisors.map(async (u) => {
        const [agg, last, assigned, completed] = await Promise.all([
          prisma.review.aggregate({
            where: { reviewerId: u.id },
            _avg: { overallScore: true },
          }),
          prisma.review.findFirst({
            where: { reviewerId: u.id },
            orderBy: { createdAt: "desc" },
          }),
          prisma.work.count({ where: { supervisorId: u.id, deletedAt: null } }),
          prisma.review.count({ where: { reviewerId: u.id } }),
        ]);
        return {
          id: u.id,
          name: u.name,
          assigned,
          completed,
          avgScore: agg._avg.overallScore ? Math.round(agg._avg.overallScore * 10) / 10 : null,
          lastReview: last?.createdAt.toISOString() ?? null,
        };
      })
    );

    const crit = await prisma.review.aggregate({
      _avg: { relevance: true, methodology: true, formatting: true, conclusion: true },
    });

    return NextResponse.json({
      stats: {
        reviewedCount: reviewed,
        avgScore: avgAll._avg.overallScore ? Math.round(avgAll._avg.overallScore * 10) / 10 : null,
        thisMonth,
      },
      leaderboard: ranked,
      reviewerWorkload,
      criteria: {
        relevance: crit._avg.relevance ? Math.round(crit._avg.relevance * 10) / 10 : 0,
        methodology: crit._avg.methodology ? Math.round(crit._avg.methodology * 10) / 10 : 0,
        formatting: crit._avg.formatting ? Math.round(crit._avg.formatting * 10) / 10 : 0,
        conclusion: crit._avg.conclusion ? Math.round(crit._avg.conclusion * 10) / 10 : 0,
      },
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
