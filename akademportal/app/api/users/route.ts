import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const me = await requireUser(req);
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || undefined;
    const q = searchParams.get("q") || "";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));

    if (me.role === "ADMIN") {
      const where: Prisma.UserWhereInput = {
        ...(role ? { role: role as "STUDENT" | "SUPERVISOR" | "ADMIN" } : {}),
        ...(q.trim() ?
          {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
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
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            facultyId: true,
            avatar: true,
            createdAt: true,
            faculty: true,
          },
        }),
      ]);
      return NextResponse.json({ total, page, limit, users });
    }

    if (role === "SUPERVISOR") {
      const where = {
        role: "SUPERVISOR" as const,
        ...(q.trim() ?
          {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      };
      const users = await prisma.user.findMany({
        where,
        take: 30,
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true, faculty: true },
      });
      return NextResponse.json({ users });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
