import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const take = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get("limit") || 8)));
    const works = await prisma.work.findMany({
      where: { deletedAt: null, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take,
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
        viewCount: w.viewCount,
        downloads: w.downloads.length,
        authorName: w.author.name,
        facultyName: w.department.faculty.name,
        supervisorName: w.supervisor?.name ?? null,
        keywords: w.keywords.map((k) => k.name),
        createdAt: w.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
