import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireStudent(req);
    const works = await prisma.work.findMany({
      where: { authorId: user.id, deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        reviews: { include: { reviewer: true }, orderBy: { createdAt: "desc" } },
        supervisor: true,
      },
    });

    return NextResponse.json({
      items: works.map((w) => {
        const rev = w.reviews[0];
        return {
          id: w.id,
          title: w.title,
          type: w.type,
          status: w.status,
          createdAt: w.createdAt.toISOString(),
          supervisorName: w.supervisor?.name ?? null,
          review: rev ?
            {
              overallScore: rev.overallScore,
              strengths: rev.strengths,
              decision: rev.decision,
              returnReason: rev.returnReason,
              reviewerName: rev.reviewer.name,
            }
          : null,
        };
      }),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
