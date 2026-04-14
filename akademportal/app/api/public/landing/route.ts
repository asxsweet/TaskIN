import { NextResponse } from "next/server";
import { getPublicLandingData } from "@/lib/public-landing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicLandingData();
    return NextResponse.json({
      stats: data.stats,
      recent: data.recent,
    });
  } catch {
    return NextResponse.json({
      stats: { worksCount: 0, usersCount: 0, facultiesCount: 0 },
      recent: [],
    });
  }
}
