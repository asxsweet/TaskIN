import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireStudent(req);

    const works = await prisma.work.findMany({
      where: { authorId: user.id, deletedAt: null },
      include: { reviews: true, downloads: true, supervisor: true },
      orderBy: { createdAt: "desc" },
    });

    const myWorksCount = works.length;
    const approvedCount = works.filter((w) => w.status === "APPROVED").length;
    const pendingCount = works.filter((w) => w.status === "PENDING").length;

    let totalDownloads = 0;
    let totalViews = 0;
    let ratingSum = 0;
    let ratingN = 0;
    for (const w of works) {
      totalDownloads += w.downloads.length;
      totalViews += w.viewCount;
      for (const r of w.reviews) {
        ratingSum += r.overallScore;
        ratingN += 1;
      }
    }
    const avgRating = ratingN > 0 ? Math.round((ratingSum / ratingN) * 10) / 10 : null;

    const recentWorks = works.slice(0, 5).map((w) => {
      const rev = w.reviews[0];
      return {
        id: w.id,
        title: w.title,
        type: w.type,
        status: w.status,
        createdAt: w.createdAt.toISOString(),
        score: rev?.overallScore ?? null,
        supervisorName: w.supervisor?.name ?? null,
      };
    });

    const notifs = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    const notifications = notifs.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    }));

    const reco = await prisma.work.findMany({
      where: {
        deletedAt: null,
        status: "APPROVED",
        authorId: { not: user.id },
        author: { facultyId: user.facultyId },
      },
      orderBy: { viewCount: "desc" },
      take: 3,
      include: {
        author: true,
        department: { include: { faculty: true } },
        supervisor: true,
        keywords: true,
        downloads: true,
      },
    });

    const recommendedWorks = reco.map((w) => ({
      id: w.id,
      title: w.title,
      abstract: w.abstract,
      type: w.type,
      year: w.year,
      viewCount: w.viewCount,
      downloads: w.downloads.length,
      authorName: w.author.name,
      facultyName: w.department.faculty.name,
      supervisorName: w.supervisor?.name ?? null,
      keywords: w.keywords.map((k) => k.name),
    }));

    return NextResponse.json({
      myWorksCount,
      approvedCount,
      pendingCount,
      totalDownloads,
      totalViews,
      avgRating,
      recentWorks,
      notifications,
      recommendedWorks,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
