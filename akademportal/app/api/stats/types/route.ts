import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const rows = await prisma.work.groupBy({
      by: ["type"],
      where: { deletedAt: null },
      _count: true,
    });
    const total = rows.reduce((s, r) => s + r._count, 0);
    return NextResponse.json({
      types: rows.map((r) => ({
        type: r.type,
        count: r._count,
        percent: total ? Math.round((r._count / total) * 1000) / 10 : 0,
      })),
      total,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
