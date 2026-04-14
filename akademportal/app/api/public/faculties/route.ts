import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const faculties = await prisma.faculty.findMany({
      orderBy: { name: "asc" },
      include: { departments: { orderBy: { name: "asc" } } },
    });
    return NextResponse.json({ faculties });
  } catch (e) {
    console.error("[api/public/faculties]", e);
    return NextResponse.json(
      {
        faculties: [],
        error: "faculties_load_failed",
        message: "Дерекқорға қосылу мүмкін болмады немесе кесте жоқ.",
      },
      { status: 503 }
    );
  }
}
