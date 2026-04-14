import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  facultyId: z.string().min(1),
  name: z.string().min(1).max(200).trim(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const facultyId = req.nextUrl.searchParams.get("facultyId");
    const where = facultyId ? { facultyId } : {};
    const rows = await prisma.department.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        faculty: { select: { id: true, name: true } },
        _count: { select: { works: true } },
      },
    });
    return NextResponse.json({
      items: rows.map((d) => ({
        id: d.id,
        name: d.name,
        facultyId: d.facultyId,
        facultyName: d.faculty.name,
        worksCount: d._count.works,
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const json = await req.json();
    const { facultyId, name } = createSchema.parse(json);
    const fac = await prisma.faculty.findUnique({ where: { id: facultyId } });
    if (!fac) return NextResponse.json({ error: "Факультет табылмады" }, { status: 400 });
    const d = await prisma.department.create({ data: { facultyId, name } });
    return NextResponse.json({ id: d.id, name: d.name, facultyId: d.facultyId });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
