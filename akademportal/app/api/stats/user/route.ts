import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);

    const [myWorks, totalDownloads, viewSum, reviewsOnMine] = await prisma.$transaction([
      prisma.work.count({ where: { authorId: user.id, deletedAt: null } }),
      prisma.download.count({
        where: { work: { authorId: user.id, deletedAt: null } },
      }),
      prisma.work.aggregate({
        where: { authorId: user.id, deletedAt: null },
        _sum: { viewCount: true },
      }),
      prisma.review.findMany({
        where: { work: { authorId: user.id } },
      }),
    ]);

    const ratingAvg =
      reviewsOnMine.length > 0 ?
        reviewsOnMine.reduce((s, r) => s + r.overallScore, 0) / reviewsOnMine.length
      : null;

    const todayViews = await prisma.work.findMany({
      where: { authorId: user.id, deletedAt: null },
      select: { viewCount: true },
    });

    return NextResponse.json({
      uploadedWorks: myWorks,
      totalDownloads,
      totalViews: viewSum._sum.viewCount ?? 0,
      avgRating: ratingAvg !== null ? Math.round(ratingAvg * 10) / 10 : null,
      todayViewersEstimate: todayViews.length,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
