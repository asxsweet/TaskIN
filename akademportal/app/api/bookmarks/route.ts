import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 20)));

    const [total, rows] = await prisma.$transaction([
      prisma.bookmark.count({ where: { userId: user.id } }),
      prisma.bookmark.findMany({
        where: { userId: user.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: "desc" },
        include: {
          work: {
            include: {
              keywords: true,
              author: true,
              department: { include: { faculty: true } },
              supervisor: true,
              downloads: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      total,
      page,
      limit,
      items: rows.map((b) => {
        const w = b.work;
        return {
          bookmarkId: b.id,
          id: w.id,
          title: w.title,
          abstract: w.abstract,
          type: w.type,
          year: w.year,
          language: w.language,
          viewCount: w.viewCount,
          downloads: w.downloads.length,
          authorName: w.author.name,
          facultyName: w.department.faculty.name,
          supervisorName: w.supervisor?.name ?? null,
          keywords: w.keywords.map((k) => k.name),
          createdAt: w.createdAt.toISOString(),
        };
      }),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
