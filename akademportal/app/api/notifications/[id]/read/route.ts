import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireUser(req);
    const { id } = await ctx.params;
    await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { read: true },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
