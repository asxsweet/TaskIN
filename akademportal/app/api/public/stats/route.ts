import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [worksCount, usersCount, facultiesCount] = await Promise.all([
      prisma.work.count({ where: { deletedAt: null, status: "APPROVED" } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.faculty.count(),
    ]);
    return NextResponse.json({
      worksCount,
      usersCount,
      facultiesCount,
      approvedWorks: worksCount,
      students: usersCount,
      faculties: facultiesCount,
    });
  } catch {
    return NextResponse.json({
      worksCount: 0,
      usersCount: 0,
      facultiesCount: 0,
      approvedWorks: 0,
      students: 0,
      faculties: 0,
    });
  }
}
