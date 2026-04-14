import type { WorkType, Language } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type LandingRecentItem = {
  id: string;
  title: string;
  abstract: string;
  type: WorkType;
  year: number;
  language: Language;
  viewCount: number;
  downloads: number;
  authorName: string;
  facultyName: string;
  supervisorName: string | null;
  keywords: string[];
  createdAt: string;
};

export type SitePayload = {
  siteName?: string;
  tagline?: string | null;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: { label: string; url: string }[];
};

const EMPTY_STATS = { worksCount: 0, usersCount: 0, facultiesCount: 0 };

export function mapSiteSettings(
  settings: {
    siteName?: string;
    tagline?: string | null;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    socialLinks: string;
  } | null
): SitePayload | null {
  if (!settings) return null;
  let social: { label: string; url: string }[] = [];
  try {
    social = JSON.parse(settings.socialLinks) as { label: string; url: string }[];
  } catch {
    social = [];
  }
  return {
    siteName: settings.siteName,
    tagline: settings.tagline,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    contactAddress: settings.contactAddress,
    socialLinks: social,
  };
}

/**
 * Loads landing stats + recent works + site settings. Never throws — returns zeros/empty on DB errors or empty DB.
 */
export async function getPublicLandingData(): Promise<{
  stats: typeof EMPTY_STATS;
  recent: LandingRecentItem[];
  site: SitePayload | null;
}> {
  try {
    const [worksCount, usersCount, facultiesCount, recentWorks, settings] = await Promise.all([
      prisma.work.count({ where: { deletedAt: null, status: "APPROVED" } }).catch(() => 0),
      prisma.user.count({ where: { role: "STUDENT" } }).catch(() => 0),
      prisma.faculty.count().catch(() => 0),
      prisma.work
        .findMany({
          where: { deletedAt: null, status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 8,
          include: {
            keywords: true,
            author: true,
            department: { include: { faculty: true } },
            supervisor: true,
            downloads: true,
          },
        })
        .catch(() => []),
      prisma.siteSettings.findUnique({ where: { id: "default" } }).catch(() => null),
    ]);

    const recent: LandingRecentItem[] = (recentWorks ?? []).map((w) => ({
      id: w.id,
      title: w.title,
      abstract: w.abstract,
      type: w.type,
      year: w.year,
      language: w.language,
      viewCount: w.viewCount,
      downloads: w.downloads.length,
      authorName: w.author.name,
      facultyName: w.department.faculty.name,
      supervisorName: w.supervisor?.name ?? null,
      keywords: w.keywords.map((k) => k.name),
      createdAt: w.createdAt.toISOString(),
    }));

    return {
      stats: {
        worksCount,
        usersCount,
        facultiesCount,
      },
      recent,
      site: mapSiteSettings(settings),
    };
  } catch {
    return {
      stats: { ...EMPTY_STATS },
      recent: [],
      site: null,
    };
  }
}
