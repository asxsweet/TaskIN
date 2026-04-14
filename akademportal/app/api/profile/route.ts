import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const me = await requireUser(req);
    const user = await prisma.user.findUnique({
      where: { id: me.id },
      include: {
        faculty: true,
        department: true,
      },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const base = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString(),
      faculty: { id: user.faculty.id, name: user.faculty.name },
      department: user.department ? { id: user.department.id, name: user.department.name } : null,
      position: user.position,
      phone: user.phone,
      employeeId: user.employeeId,
      approvalStatus: user.approvalStatus,
      approvedAt: user.approvedAt?.toISOString() ?? null,
    };

    if (user.role === "STUDENT") {
      const [worksAgg, bookmarkCount, recentWorks, viewsSum] = await Promise.all([
        prisma.work.groupBy({
          by: ["status"],
          where: { authorId: user.id, deletedAt: null },
          _count: true,
        }),
        prisma.bookmark.count({ where: { userId: user.id } }),
        prisma.work.findMany({
          where: { authorId: user.id, deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            year: true,
            viewCount: true,
            createdAt: true,
          },
        }),
        prisma.work.aggregate({
          where: { authorId: user.id, deletedAt: null },
          _sum: { viewCount: true },
        }),
      ]);

      const statusMap = Object.fromEntries(worksAgg.map((g) => [g.status, g._count])) as Record<
        string,
        number
      >;
      const worksTotal = worksAgg.reduce((s, g) => s + g._count, 0);

      return NextResponse.json({
        profile: base,
        stats: {
          worksTotal,
          worksApproved: statusMap.APPROVED ?? 0,
          worksPending: statusMap.PENDING ?? 0,
          worksReturned: statusMap.RETURNED ?? 0,
          bookmarkCount,
          totalViews: viewsSum._sum.viewCount ?? 0,
        },
        recentWorks: recentWorks.map((w) => ({
          ...w,
          createdAt: w.createdAt.toISOString(),
        })),
      });
    }

    if (user.role === "SUPERVISOR") {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [supervisedCount, reviewCount, studentsGrouped, pendingQueue, reviewsThisMonth, recentReviews] =
        await Promise.all([
          prisma.work.count({ where: { supervisorId: user.id, deletedAt: null } }),
          prisma.review.count({ where: { reviewerId: user.id } }),
          prisma.work.groupBy({
            by: ["authorId"],
            where: { supervisorId: user.id, deletedAt: null },
          }).then((g) => g.length),
          prisma.work.count({
            where: { supervisorId: user.id, deletedAt: null, status: "PENDING" },
          }),
          prisma.review.count({
            where: { reviewerId: user.id, createdAt: { gte: monthStart } },
          }),
          prisma.review.findMany({
            where: { reviewerId: user.id },
            orderBy: { createdAt: "desc" },
            take: 8,
            include: {
              work: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  author: { select: { name: true } },
                },
              },
            },
          }),
        ]);

      return NextResponse.json({
        profile: base,
        stats: {
          supervisedWorksCount: supervisedCount,
          reviewsTotal: reviewCount,
          reviewsThisMonth,
          studentsCount: studentsGrouped,
          pendingQueue,
        },
        recentReviews: recentReviews.map((r) => ({
          id: r.id,
          title: r.work.title,
          type: r.work.type,
          studentName: r.work.author.name,
          workId: r.work.id,
          overallScore: r.overallScore,
          decision: r.decision,
          createdAt: r.createdAt.toISOString(),
        })),
      });
    }

    /** ADMIN — қысқа профиль */
    return NextResponse.json({
      profile: base,
      stats: null,
      recentWorks: [],
      recentReviews: [],
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
