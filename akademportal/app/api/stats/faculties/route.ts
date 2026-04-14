import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const faculties = await prisma.faculty.findMany({ orderBy: { name: "asc" } });
    const counts = await prisma.work.groupBy({
      by: ["departmentId"],
      where: { deletedAt: null },
      _count: true,
    });
    const deps = await prisma.department.findMany({
      select: { id: true, facultyId: true },
    });
    const depToFac = Object.fromEntries(deps.map((d) => [d.id, d.facultyId]));
    const byFac: Record<string, number> = {};
    for (const c of counts) {
      const fid = depToFac[c.departmentId];
      if (fid) byFac[fid] = (byFac[fid] ?? 0) + c._count;
    }

    return NextResponse.json({
      faculties: faculties.map((f) => ({
        id: f.id,
        name: f.name,
        worksCount: byFac[f.id] ?? 0,
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
