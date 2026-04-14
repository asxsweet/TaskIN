import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const count = await prisma.work.count({
      where: { createdAt: { gte: start }, deletedAt: null },
    });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
