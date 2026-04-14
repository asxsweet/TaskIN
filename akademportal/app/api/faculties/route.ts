import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    const faculties = await prisma.faculty.findMany({
      orderBy: { name: "asc" },
      include: { departments: { orderBy: { name: "asc" } } },
    });
    return NextResponse.json({ faculties });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
