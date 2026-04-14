import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireUser(req);
    const { id: reviewId } = await ctx.params;
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const existing = await prisma.reviewHelpful.findUnique({
      where: { userId_reviewId: { userId: user.id, reviewId } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.reviewHelpful.delete({ where: { id: existing.id } }),
        prisma.review.update({
          where: { id: reviewId },
          data: { helpfulCount: { decrement: 1 } },
        }),
      ]);
      return NextResponse.json({ helpful: false, helpfulCount: review.helpfulCount - 1 });
    }

    await prisma.$transaction([
      prisma.reviewHelpful.create({ data: { userId: user.id, reviewId } }),
      prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      }),
    ]);
    const updated = await prisma.review.findUnique({ where: { id: reviewId } });
    return NextResponse.json({ helpful: true, helpfulCount: updated?.helpfulCount ?? 0 });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
