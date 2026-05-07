import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

type Ctx = { params: Promise<{ workId: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireUser(req);
    const { workId } = await ctx.params;
    const body = (await req.json().catch(() => ({}))) as { folderId?: string | null };
    const work = await prisma.work.findFirst({
      where: { id: workId, deletedAt: null, status: "APPROVED" },
    });
    if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const existing = await prisma.bookmark.findUnique({
      where: { userId_workId: { userId: user.id, workId } },
    });
    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ bookmarked: false });
    }
    let folderId: string | undefined;
    if (body.folderId) {
      const folder = await prisma.bookmarkFolder.findFirst({
        where: { id: body.folderId, userId: user.id },
      });
      if (folder) folderId = folder.id;
    }
    await prisma.bookmark.create({ data: { userId: user.id, workId, folderId } });
    return NextResponse.json({ bookmarked: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
