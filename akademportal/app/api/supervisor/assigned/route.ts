import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSupervisorOrAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireSupervisorOrAdmin(req);
    const isAdmin = user.role === "ADMIN";
    const sid = user.id;

    const works = await prisma.work.findMany({
      where: {
        deletedAt: null,
        status: "PENDING",
        ...(isAdmin ? {} : { supervisorId: sid }),
      },
      orderBy: { createdAt: "asc" },
      include: {
        author: { include: { faculty: true } },
        department: { include: { faculty: true } },
      },
    });

    const now = Date.now();
    const items = works.map((w) => {
      const days = Math.floor((now - w.createdAt.getTime()) / 86400000);
      return {
        id: w.id,
        title: w.title,
        type: w.type,
        language: w.language,
        abstract: w.abstract.slice(0, 280),
        daysWaiting: days,
        bucket: days < 3 ? "new" : days <= 7 ? "wait" : "late",
        student: {
          name: w.author.name,
          email: w.author.email,
          facultyName: w.author.faculty.name,
        },
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
