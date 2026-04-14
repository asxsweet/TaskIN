import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    await requireUser(req);
    const { id } = await ctx.params;
    const work = await prisma.work.findFirst({ where: { id, deletedAt: null } });
    if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = await prisma.work.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return NextResponse.json({ viewCount: updated.viewCount });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
