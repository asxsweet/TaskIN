import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { A, R } from "@/lib/prisma-enums";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const q = (req.nextUrl.searchParams.get("q") || "").trim();
    const users = await prisma.user.findMany({
      where: {
        role: R.SUPERVISOR,
        approvalStatus: A.APPROVED,
        ...(q ?
          {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      },
      take: 30,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
        faculty: { select: { name: true } },
        department: { select: { name: true } },
      },
    });
    return NextResponse.json({
      supervisors: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        position: u.position,
        facultyName: u.faculty.name,
        departmentName: u.department?.name ?? null,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
