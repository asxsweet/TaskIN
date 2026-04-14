import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-user";

const patchSchema = z.object({
  siteName: z.string().min(1).max(200).optional(),
  tagline: z.string().max(2000).optional().nullable(),
  logoUrl: z.string().url().optional().nullable().or(z.literal("")),
  emailFrom: z.string().email().optional().nullable(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(64).optional(),
  contactAddress: z.string().max(4000).optional(),
  socialLinks: z.string().optional(),
  emailTemplates: z.string().optional().nullable(),
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const s = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!s) return NextResponse.json({ error: "Баптаулар табылмады" }, { status: 404 });
    return NextResponse.json({
      siteName: s.siteName,
      tagline: s.tagline,
      logoUrl: s.logoUrl,
      emailFrom: s.emailFrom,
      contactEmail: s.contactEmail,
      contactPhone: s.contactPhone,
      contactAddress: s.contactAddress,
      socialLinks: s.socialLinks,
      emailTemplates: s.emailTemplates,
    });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req);
    const json = await req.json();
    const body = patchSchema.parse(json);
    const data: Record<string, unknown> = {};
    if (body.siteName !== undefined) data.siteName = body.siteName;
    if (body.tagline !== undefined) data.tagline = body.tagline;
    if (body.logoUrl !== undefined) data.logoUrl = body.logoUrl || null;
    if (body.emailFrom !== undefined) data.emailFrom = body.emailFrom;
    if (body.contactEmail !== undefined) data.contactEmail = body.contactEmail;
    if (body.contactPhone !== undefined) data.contactPhone = body.contactPhone;
    if (body.contactAddress !== undefined) data.contactAddress = body.contactAddress;
    if (body.socialLinks !== undefined) data.socialLinks = body.socialLinks;
    if (body.emailTemplates !== undefined) data.emailTemplates = body.emailTemplates;
    await prisma.siteSettings.update({
      where: { id: "default" },
      data: data as never,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 401) return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
    if (err.status === 403) return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
    return NextResponse.json({ error: "Сервер қатесі" }, { status: 500 });
  }
}
