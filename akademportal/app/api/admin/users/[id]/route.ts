import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";

const patchSchema = z.object({
  role: z.enum(["STUDENT", "SUPERVISOR", "ADMIN"]).optional(),
  name: z.string().min(2).max(120).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const body = patchSchema.parse(await req.json());
    await prisma.user.update({
      where: { id },
      data: {
        ...(body.role ? { role: body.role } : {}),
        ...(body.name ? { name: body.name } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await ctx.params;
    if (id === admin.id) {
      return NextResponse.json({ error: "Өзіңізді жоя алмайсыз" }, { status: 400 });
    }
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
