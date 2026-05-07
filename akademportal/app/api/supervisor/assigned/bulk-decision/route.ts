import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSupervisorOrAdmin } from "@/lib/api-user";
import { notifyUser } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const user = await requireSupervisorOrAdmin(req);
    const body = (await req.json()) as {
      workIds?: string[];
      decision?: "APPROVE" | "RETURN";
      template?: string;
    };
    const workIds = Array.isArray(body.workIds) ? body.workIds.filter(Boolean) : [];
    if (workIds.length === 0) {
      return NextResponse.json({ error: "workIds required" }, { status: 400 });
    }
    if (body.decision !== "APPROVE" && body.decision !== "RETURN") {
      return NextResponse.json({ error: "decision required" }, { status: 400 });
    }

    const works = await prisma.work.findMany({
      where: {
        id: { in: workIds },
        deletedAt: null,
        ...(user.role === "SUPERVISOR" ? { supervisorId: user.id } : {}),
      },
      select: { id: true, authorId: true },
    });
    const status = body.decision === "APPROVE" ? "APPROVED" : "RETURNED";
    const reviewDecision = body.decision === "APPROVE" ? "APPROVE" : "RETURN";
    const template = (body.template ?? "").trim() || "Үлгі пікір";

    await prisma.$transaction(async (tx) => {
      for (const w of works) {
        await tx.review.create({
          data: {
            workId: w.id,
            reviewerId: user.id,
            relevance: 4,
            methodology: 4,
            formatting: 4,
            conclusion: 4,
            overallScore: 4,
            strengths: template,
            suggestions: template,
            comment: template,
            decision: reviewDecision,
            returnReason: reviewDecision === "RETURN" ? template : null,
          },
        });
        await tx.work.update({
          where: { id: w.id },
          data: { status },
        });
      }
    });
    await Promise.all(
      works.map((w) =>
        notifyUser(
          w.authorId,
          status === "APPROVED" ? "WORK_APPROVED" : "WORK_RETURNED",
          status === "APPROVED" ? "Жұмысыңыз мақұлданды" : "Жұмысыңыз түзетуге қайтарылды",
          template
        )
      )
    );

    return NextResponse.json({ ok: true, processed: works.length });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
