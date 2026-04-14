import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";
import { reviewCreateSchema } from "@/lib/validations";
import { indexWork } from "@/lib/elasticsearch";
import { notifyNewReview, notifyWorkStatus } from "@/lib/email";
import { notifyUser } from "@/lib/notifications";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    await requireUser(req);
    const { id } = await ctx.params;
    const reviews = await prisma.review.findMany({
      where: { workId: id },
      orderBy: { createdAt: "desc" },
      include: { reviewer: true },
    });
    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        relevance: r.relevance,
        methodology: r.methodology,
        formatting: r.formatting,
        conclusion: r.conclusion,
        overallScore: r.overallScore,
        strengths: r.strengths,
        suggestions: r.suggestions,
        comment: r.comment,
        decision: r.decision,
        helpfulCount: r.helpfulCount,
        createdAt: r.createdAt.toISOString(),
        reviewer: { id: r.reviewer.id, name: r.reviewer.name },
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const user = await requireUser(req);
    if (user.role !== "SUPERVISOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id: workId } = await ctx.params;
    const work = await prisma.work.findFirst({ where: { id: workId, deletedAt: null } });
    if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (user.role === "SUPERVISOR" && work.supervisorId && work.supervisorId !== user.id) {
      return NextResponse.json({ error: "Not your supervised work" }, { status: 403 });
    }

    const json = await req.json();
    const data = reviewCreateSchema.parse(json);

    const overall =
      (data.relevance + data.methodology + data.formatting + data.conclusion) / 4;

    const decision = data.decision;
    let newStatus = work.status;
    if (decision === "APPROVE") newStatus = "APPROVED";
    else if (decision === "RETURN") newStatus = "RETURNED";
    else if (decision === "REJECT") newStatus = "REJECTED";

    const [review] = await prisma.$transaction([
      prisma.review.create({
        data: {
          workId,
          reviewerId: user.id,
          relevance: data.relevance,
          methodology: data.methodology,
          formatting: data.formatting,
          conclusion: data.conclusion,
          overallScore: overall,
          strengths: data.strengths,
          suggestions: data.suggestions,
          comment: data.comment,
          decision,
          returnReason: data.returnReason ?? null,
        },
      }),
      prisma.work.update({
        where: { id: workId },
        data: { status: newStatus },
      }),
    ]);

    const author = await prisma.user.findUnique({ where: { id: work.authorId } });
    if (author?.email) {
      await notifyNewReview(author.email, work.title);
      await notifyWorkStatus(author.email, work.title, newStatus);
    }
    await notifyUser(
      work.authorId,
      "REVIEW",
      "Жаңа баға берілді",
      work.title
    );

    await indexWork(workId).catch(() => undefined);

    return NextResponse.json({ id: review.id });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const message = e instanceof Error ? e.message : "Invalid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
