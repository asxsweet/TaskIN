import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";
import { A } from "@/lib/prisma-enums";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalWorks,
      totalUsers,
      totalStudents,
      totalSupervisors,
      pendingWorks,
      pendingApprovals,
      todayUploads,
      monthDownloads,
    ] = await prisma.$transaction([
      prisma.work.count({ where: { deletedAt: null } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "SUPERVISOR" } }),
      prisma.work.count({ where: { deletedAt: null, status: "PENDING" } }),
      prisma.user.count({ where: { role: "SUPERVISOR", approvalStatus: A.PENDING } }),
      prisma.work.count({ where: { deletedAt: null, createdAt: { gte: startOfDay } } }),
      prisma.download.count({ where: { createdAt: { gte: monthStart } } }),
    ]);

    const faculties = await prisma.faculty.findMany({ orderBy: { name: "asc" } });
    const depCounts = await prisma.work.groupBy({
      by: ["departmentId"],
      where: { deletedAt: null },
      _count: true,
    });
    const deps = await prisma.department.findMany({ select: { id: true, facultyId: true } });
    const depToFac = Object.fromEntries(deps.map((d) => [d.id, d.facultyId]));
    const byFac: Record<string, number> = {};
    for (const c of depCounts) {
      const fid = depToFac[c.departmentId];
      if (fid) byFac[fid] = (byFac[fid] ?? 0) + c._count;
    }
    const facultyStats = faculties.map((f) => ({
      id: f.id,
      name: f.name,
      worksCount: byFac[f.id] ?? 0,
    }));

    const typeGroup = await prisma.work.groupBy({
      by: ["type"],
      where: { deletedAt: null },
      _count: true,
    });
    const typeTotal = typeGroup.reduce((s, t) => s + t._count, 0);
    const typeStats = typeGroup.map((t) => ({
      type: t.type,
      count: t._count,
      percent: typeTotal > 0 ? Math.round((t._count / typeTotal) * 1000) / 10 : 0,
    }));

    const activityLast30: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const next = new Date(day.getTime() + 86400000);
      const count = await prisma.work.count({
        where: { deletedAt: null, createdAt: { gte: day, lt: next } },
      });
      activityLast30.push({ date: day.toISOString().slice(0, 10), count });
    }

    return NextResponse.json({
      totalWorks,
      totalUsers,
      totalStudents,
      totalSupervisors,
      pendingWorks,
      pendingApprovals,
      todayUploads,
      monthDownloads,
      facultyStats,
      typeStats,
      activityLast30,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
