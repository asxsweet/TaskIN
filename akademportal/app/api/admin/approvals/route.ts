import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { A, R } from "@/lib/prisma-enums";
import { requireAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "pending";

    const statusFilter: (typeof A)[keyof typeof A] | undefined =
      filter === "pending" ? A.PENDING
      : filter === "approved" ? A.APPROVED
      : filter === "rejected" ? A.REJECTED
      : filter === "all" ? undefined
      : A.PENDING;

    const where: Prisma.UserWhereInput = {
      role: R.SUPERVISOR,
      ...(statusFilter !== undefined ? { approvalStatus: statusFilter } : {}),
    };

    const [pendingCount, approvedCount, rejectedCount, users] = await prisma.$transaction([
      prisma.user.count({ where: { role: R.SUPERVISOR, approvalStatus: A.PENDING } }),
      prisma.user.count({ where: { role: R.SUPERVISOR, approvalStatus: A.APPROVED } }),
      prisma.user.count({ where: { role: R.SUPERVISOR, approvalStatus: A.REJECTED } }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          faculty: true,
          department: true,
          approver: { select: { id: true, name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: { pendingCount, approvedCount, rejectedCount },
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        position: u.position,
        phone: u.phone,
        employeeId: u.employeeId,
        approvalStatus: u.approvalStatus,
        approvalNote: u.approvalNote,
        approvedAt: u.approvedAt?.toISOString() ?? null,
        approverName: u.approver?.name ?? null,
        facultyName: u.faculty.name,
        departmentName: u.department?.name ?? null,
        createdAt: u.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
