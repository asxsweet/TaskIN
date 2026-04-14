import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(5000, Math.max(1, Number(searchParams.get("limit") || 20)));
    const status = searchParams.get("status") || undefined;
    const facultyId = searchParams.get("facultyId") || undefined;
    const year = searchParams.get("year");
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;

    const where: Prisma.WorkWhereInput = { deletedAt: null };
    if (status) where.status = status as never;
    if (type) where.type = type as never;
    if (year) where.year = Number(year);
    if (facultyId) {
      where.department = { facultyId };
    }
    if (search?.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { author: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    const [total, works] = await prisma.$transaction([
      prisma.work.count({ where }),
      prisma.work.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: true,
          department: { include: { faculty: true } },
        },
      }),
    ]);

    return NextResponse.json({
      total,
      page,
      items: works.map((w) => ({
        id: w.id,
        title: w.title,
        authorName: w.author.name,
        facultyName: w.department.faculty.name,
        type: w.type,
        status: w.status,
        plagiarismScore: w.plagiarismScore,
        createdAt: w.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
