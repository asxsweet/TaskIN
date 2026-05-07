import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";
import { userUpdateSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/security";

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
        department: true,
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
      department: user.department,
      avatar: user.avatar,
      phone: user.phone,
      position: user.position,
      employeeId: user.employeeId,
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
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const json = await req.json();
    const data = userUpdateSchema.parse(json);
    if (data.facultyId) {
      const fac = await prisma.faculty.findUnique({ where: { id: data.facultyId } });
      if (!fac) return NextResponse.json({ error: "Факультет табылмады" }, { status: 400 });
    }
    if (data.departmentId) {
      const dep = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!dep) return NextResponse.json({ error: "Кафедра табылмады" }, { status: 400 });
      const targetFacultyId = data.facultyId ?? existing.facultyId;
      if (dep.facultyId !== targetFacultyId) {
        return NextResponse.json({ error: "Кафедра таңдалған факультетке тиесілі емес" }, { status: 400 });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: sanitizeText(data.name),
        avatar: data.avatar,
        facultyId: data.facultyId,
        departmentId: data.departmentId,
        employeeId: data.employeeId ? sanitizeText(data.employeeId) : null,
        phone: data.phone ? sanitizeText(data.phone) : null,
        position: data.position ? sanitizeText(data.position) : null,
        bio: data.bio ? sanitizeText(data.bio) : null,
        socialLinks: data.socialLinks ? sanitizeText(data.socialLinks) : null,
        interests: data.interests ? sanitizeText(data.interests) : null,
      },
    });
    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar,
      facultyId: updated.facultyId,
      departmentId: updated.departmentId,
      employeeId: updated.employeeId,
      phone: updated.phone,
      position: updated.position,
      bio: updated.bio,
      socialLinks: updated.socialLinks,
      interests: updated.interests,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const message = e instanceof Error ? e.message : "Invalid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
