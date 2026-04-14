import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const supervisors = await prisma.user.findMany({
      where: { role: "SUPERVISOR" },
      include: {
        supervised: { where: { deletedAt: null } },
        reviews: true,
      },
    });

    const data = supervisors.map((s) => {
      const completed = s.reviews.length;
      const assigned = s.supervised.length;
      const avg =
        s.reviews.length > 0 ?
          s.reviews.reduce((a, r) => a + r.overallScore, 0) / s.reviews.length
        : 0;
      return {
        id: s.id,
        name: s.name,
        assigned,
        completed,
        avgScore: Math.round(avg * 100) / 100,
      };
    });

    return NextResponse.json({ reviewers: data });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
