import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-user";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const unread = await prisma.notification.count({
      where: { userId: user.id, read: false },
    });
    const items = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return NextResponse.json({
      unread,
      items: items.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        link: n.link,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
