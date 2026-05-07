import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";
import { writeAuditLog } from "@/lib/audit";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await ctx.params;
    const body = (await req.json()) as { moderationFlag?: boolean };
    if (typeof body.moderationFlag !== "boolean") {
      return NextResponse.json({ error: "moderationFlag required" }, { status: 400 });
    }
    const work = await prisma.work.update({
      where: { id },
      data: { moderationFlag: body.moderationFlag },
      select: { id: true, moderationFlag: true },
    });
    await writeAuditLog({
      req,
      actorId: admin.id,
      action: body.moderationFlag ? "WORK_FLAG_SET" : "WORK_FLAG_CLEARED",
      entity: "Work",
      entityId: work.id,
    });
    return NextResponse.json(work);
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
