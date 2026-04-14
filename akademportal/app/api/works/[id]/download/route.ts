import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";
import { getSignedDownloadUrl } from "@/lib/minio";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    await requireUser(req);
    const { id } = await ctx.params;
    const work = await prisma.work.findFirst({
      where: { id, deletedAt: null, status: "APPROVED" },
    });
    if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const url = await getSignedDownloadUrl(work.filePath, 900);
    return NextResponse.json({ url, expiresIn: 900 });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
