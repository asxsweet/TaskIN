import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const facultyId = req.nextUrl.searchParams.get("facultyId");
    if (!facultyId) {
      return NextResponse.json({ error: "facultyId қажет" }, { status: 400 });
    }
    const departments = await prisma.department.findMany({
      where: { facultyId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, facultyId: true },
    });
    return NextResponse.json({ departments });
  } catch {
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
