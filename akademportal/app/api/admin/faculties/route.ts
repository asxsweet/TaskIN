import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

const createSchema = z.object({ name: z.string().min(1).max(200).trim() });

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const faculties = await prisma.faculty.findMany({
      orderBy: { name: "asc" },
      include: {
        departments: {
          include: { _count: { select: { works: true } } },
        },
      },
    });
    const items = faculties.map((f) => ({
      id: f.id,
      name: f.name,
      departmentsCount: f.departments.length,
      worksCount: f.departments.reduce((sum, d) => sum + d._count.works, 0),
    }));
    return NextResponse.json({ items });
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
    const { name } = createSchema.parse(json);
    const f = await prisma.faculty.create({ data: { name } });
    return NextResponse.json({ id: f.id, name: f.name });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
