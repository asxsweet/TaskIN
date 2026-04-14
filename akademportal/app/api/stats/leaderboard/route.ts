import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const facultyId = searchParams.get("facultyId") || undefined;
    const year = searchParams.get("year");

    const works = await prisma.work.findMany({
      where: {
        deletedAt: null,
        status: "APPROVED",
        ...(facultyId ? { department: { facultyId } } : {}),
        ...(year ? { year: Number(year) } : {}),
      },
      include: {
        author: true,
        department: { include: { faculty: true } },
        reviews: true,
        downloads: true,
      },
      take: 200,
    });

    const ranked = works
      .map((w) => {
        const avg =
          w.reviews.length > 0 ?
            w.reviews.reduce((s, r) => s + r.overallScore, 0) / w.reviews.length
          : 0;
        return {
          id: w.id,
          title: w.title,
          author: w.author.name,
          faculty: w.department.faculty.name,
          score: Math.round(avg * 100) / 100,
          downloads: w.downloads.length,
        };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map((r, i) => ({ rank: i + 1, ...r }));

    return NextResponse.json({ leaderboard: ranked });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
