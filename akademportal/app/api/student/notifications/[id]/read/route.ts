import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/api-user";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireStudent(req);
    const { id } = await ctx.params;
    const n = await prisma.notification.findFirst({
      where: { id, userId: user.id },
    });
    if (!n) return NextResponse.json({ error: "Табылмады" }, { status: 404 });
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
