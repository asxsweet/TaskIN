import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";
import { userUpdateSchema } from "@/lib/validations";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    if (me.id !== id && me.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        faculty: true,
        works: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            department: { include: { faculty: true } },
            keywords: true,
          },
        },
      },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      faculty: user.faculty,
      avatar: user.avatar,
      works: user.works.map((w) => ({
        id: w.id,
        title: w.title,
        status: w.status,
        type: w.type,
        year: w.year,
        createdAt: w.createdAt.toISOString(),
        facultyName: w.department.faculty.name,
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const me = await requireUser(req);
    const { id } = await ctx.params;
    if (me.id !== id && me.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const json = await req.json();
    const data = userUpdateSchema.parse(json);
    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        avatar: data.avatar,
        facultyId: data.facultyId,
      },
    });
    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar,
      facultyId: updated.facultyId,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const message = e instanceof Error ? e.message : "Invalid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
