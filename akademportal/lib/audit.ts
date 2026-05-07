import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type AuditInput = {
  req?: NextRequest;
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function writeAuditLog(input: AuditInput) {
  const ip = input.req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = input.req?.headers.get("user-agent") ?? null;
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      ip,
      userAgent,
    },
  });
}
