import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const full = await prisma.user.findUnique({
      where: { id: user.id },
      include: { faculty: true },
    });
    if (!full) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: full.id,
      name: full.name,
      email: full.email,
      role: full.role,
      facultyId: full.facultyId,
      faculty: full.faculty,
      avatar: full.avatar,
      createdAt: full.createdAt.toISOString(),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
