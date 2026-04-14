import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSupervisorOrAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireSupervisorOrAdmin(req);
    const isAdmin = user.role === "ADMIN";
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get("limit") || 20)));
    const decision = req.nextUrl.searchParams.get("decision") || undefined;

    const where = {
      ...(isAdmin ? {} : { reviewerId: user.id }),
      ...(decision ? { decision: decision as "APPROVE" | "RETURN" | "REJECT" } : {}),
    };

    const [total, rows] = await prisma.$transaction([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          work: { include: { author: true, department: { include: { faculty: true } } } },
        },
      }),
    ]);

    return NextResponse.json({
      total,
      page,
      items: rows.map((r) => ({
        id: r.id,
        studentName: r.work.author.name,
        title: r.work.title,
        type: r.work.type,
        score: r.overallScore,
        decision: r.decision,
        createdAt: r.createdAt.toISOString(),
        facultyName: r.work.department.faculty.name,
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
