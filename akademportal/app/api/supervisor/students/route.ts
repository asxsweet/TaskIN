import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSupervisorOrAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireSupervisorOrAdmin(req);
    const isAdmin = user.role === "ADMIN";
    const q = (req.nextUrl.searchParams.get("q") || "").trim();

    const authorIds = await prisma.work.findMany({
      where: { deletedAt: null, ...(isAdmin ? {} : { supervisorId: user.id }) },
      distinct: ["authorId"],
      select: { authorId: true },
    });
    const ids = authorIds.map((a) => a.authorId);

    const students = await prisma.user.findMany({
      where: {
        id: { in: ids },
        role: "STUDENT",
        ...(q ?
          {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      },
      include: {
        faculty: true,
        department: true,
        works: {
          where: { deletedAt: null, ...(isAdmin ? {} : { supervisorId: user.id }) },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { reviews: true },
        },
      },
    });

    const items = students.map((s) => {
      const ws = s.works;
      const scores = ws.flatMap((w) => w.reviews.map((r) => r.overallScore));
      const avg =
        scores.length > 0 ?
          Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : null;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        facultyName: s.faculty.name,
        departmentName: s.department?.name ?? null,
        worksCount: ws.length,
        avgScore: avg,
        lastSubmission: ws[0]?.createdAt.toISOString() ?? null,
        works: ws.slice(0, 3).map((w) => ({
          id: w.id,
          title: w.title,
          status: w.status,
        })),
      };
    });

    return NextResponse.json({ items });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
