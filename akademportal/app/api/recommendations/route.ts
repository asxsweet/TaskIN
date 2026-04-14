import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const works = await prisma.work.findMany({
      where: {
        deletedAt: null,
        status: "APPROVED",
        author: { facultyId: user.facultyId },
        NOT: { authorId: user.id },
      },
      orderBy: { downloads: { _count: "desc" } },
      take: 6,
      include: {
        keywords: true,
        author: true,
        department: { include: { faculty: true } },
        supervisor: true,
        downloads: true,
      },
    });
    return NextResponse.json({
      items: works.map((w) => ({
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
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
