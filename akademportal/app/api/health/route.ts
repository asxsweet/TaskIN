import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { esAvailable } from "@/lib/elasticsearch";

export async function GET() {
  const startedAt = Date.now();
  let dbOk = true;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbOk = false;
  }

  const status = dbOk ? "ok" : "degraded";
  return NextResponse.json(
    {
      status,
      checks: {
        database: dbOk ? "ok" : "failed",
        elasticsearchConfigured: esAvailable(),
      },
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
    },
    { status: dbOk ? 200 : 503 }
  );
}
