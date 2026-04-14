import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapSiteSettings } from "@/lib/public-landing";

export const dynamic = "force-dynamic";

const empty = {
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  socialLinks: [] as { label: string; url: string }[],
};

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } }).catch(() => null);
    const mapped = mapSiteSettings(settings);
    if (!mapped) {
      return NextResponse.json(empty);
    }
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(empty);
  }
}
