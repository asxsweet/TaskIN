import { prisma } from "@/lib/prisma";

export async function notifyUser(userId: string, type: string, title: string, body?: string) {
  await prisma.notification.create({
    data: { userId, type, title, body: body ?? null },
  });
}
