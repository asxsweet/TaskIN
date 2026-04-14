import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSupervisorOrAdmin } from "@/lib/api-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireSupervisorOrAdmin(req);
    const unread = await prisma.notification.count({
      where: { userId: user.id, read: false },
    });
    const items = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
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
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
