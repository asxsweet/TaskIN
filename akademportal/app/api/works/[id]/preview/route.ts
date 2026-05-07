import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireUser(req);
    const { id } = await ctx.params;
    const work = await prisma.work.findFirst({
      where: { id, deletedAt: null },
    });
    if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const canPreview =
      work.status === "APPROVED" ||
      user.role === "ADMIN" ||
      work.authorId === user.id ||
      (user.role === "SUPERVISOR" && work.supervisorId === user.id);
    if (!canPreview) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!work.fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    if (work.fileMimeType !== "application/pdf") {
      return NextResponse.json({ error: "Inline preview тек PDF үшін қолжетімді" }, { status: 400 });
    }

    const bin = Buffer.from(work.fileData);
    const safeName = encodeURIComponent(work.fileName || "work-file.pdf");
    return new NextResponse(bin, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(bin.length),
        "Content-Disposition": `inline; filename*=UTF-8''${safeName}`,
      },
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
