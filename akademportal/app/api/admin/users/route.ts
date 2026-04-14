import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || undefined;
    const q = (searchParams.get("q") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));

    const where: Prisma.UserWhereInput = {
      ...(role ? { role: role as "STUDENT" | "SUPERVISOR" | "ADMIN" } : {}),
      ...(q ?
        {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    };

    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          faculty: true,
          _count: { select: { works: true, supervised: true } },
        },
      }),
    ]);

    return NextResponse.json({
      total,
      page,
      items: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        facultyName: u.faculty.name,
        worksCount: u.role === "STUDENT" ? u._count.works : u._count.supervised,
        approvalStatus: u.approvalStatus,
        createdAt: u.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
