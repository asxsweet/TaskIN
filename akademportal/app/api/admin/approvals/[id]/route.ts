import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { A, R } from "@/lib/prisma-enums";
import { requireAdmin } from "@/lib/api-user";
import { notifySupervisorApproved, notifySupervisorRejected } from "@/lib/email";

const patchSchema = z.object({
  action: z.enum(["approve", "reject"]),
  note: z.string().max(2000).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const admin = await requireAdmin(req);
    const { id } = await ctx.params;
    const json = await req.json();
    const body = patchSchema.parse(json);

    const target = await prisma.user.findFirst({
      where: { id, role: R.SUPERVISOR },
    });
    if (!target) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (body.action === "approve") {
      if (target.approvalStatus !== A.PENDING) {
        return NextResponse.json({ error: "Already processed" }, { status: 400 });
      }
      await prisma.user.update({
        where: { id },
        data: {
          approvalStatus: A.APPROVED,
          approvedById: admin.id,
          approvedAt: new Date(),
          approvalNote: null,
        },
      });
      const baseUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
      const loginUrl = `${baseUrl}/auth`;
      await notifySupervisorApproved(target.email, target.name, loginUrl);
      return NextResponse.json({ ok: true });
    }

    if (target.approvalStatus !== A.PENDING) {
      return NextResponse.json({ error: "Already processed" }, { status: 400 });
    }
    if (!body.note?.trim()) {
      return NextResponse.json({ error: "note required for reject" }, { status: 400 });
    }
    await prisma.user.update({
      where: { id },
      data: {
        approvalStatus: A.REJECTED,
        approvalNote: body.note.trim(),
        approvedById: admin.id,
        approvedAt: new Date(),
      },
    });
    await notifySupervisorRejected(target.email, target.name, body.note.trim());
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
