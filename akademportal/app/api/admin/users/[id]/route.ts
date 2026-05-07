import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";
import { writeAuditLog } from "@/lib/audit";
import { sanitizeText } from "@/lib/security";

const patchSchema = z.object({
  role: z.enum(["STUDENT", "SUPERVISOR", "ADMIN"]).optional(),
  name: z.string().min(2).max(120).optional(),
  isLocked: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await ctx.params;
    const body = patchSchema.parse(await req.json());
    const payload = {
      ...(body.role ? { role: body.role } : {}),
      ...(body.name ? { name: sanitizeText(body.name) } : {}),
      ...(typeof body.isLocked === "boolean" ? { isLocked: body.isLocked } : {}),
    };
    await prisma.user.update({
      where: { id },
      data: payload,
    });
    await writeAuditLog({
      req,
      actorId: admin.id,
      action: "ADMIN_USER_PATCH",
      entity: "User",
      entityId: id,
      metadata: payload,
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
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await writeAuditLog({
      req,
      actorId: admin.id,
      action: "ADMIN_USER_DELETE",
      entity: "User",
      entityId: id,
      metadata: null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
