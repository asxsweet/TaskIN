import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

const patchSchema = z.object({ name: z.string().min(1).max(200).trim() });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    const json = await req.json();
    const { name } = patchSchema.parse(json);
    await prisma.faculty.update({ where: { id: params.id }, data: { name } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(_req);
    const workCount = await prisma.work.count({
      where: { deletedAt: null, department: { facultyId: params.id } },
    });
    if (workCount > 0) {
      return NextResponse.json(
        { error: "Осы факультетте жұмыстар бар — жою мүмкін емес" },
        { status: 400 }
      );
    }
    await prisma.department.deleteMany({ where: { facultyId: params.id } });
    await prisma.faculty.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
