import type { WorkStatus, WorkType, Language, Role, Decision } from "@prisma/client";

export type WorkListItem = {
  id: string;
  title: string;
  abstract: string;
  type: WorkType;
  year: number;
  language: Language;
  status: WorkStatus;
  viewCount: number;
  fileSize: number;
  pageCount: number | null;
  plagiarismScore: number | null;
  createdAt: string;
  author: { id: string; name: string; avatar: string | null };
  faculty: { id: string; name: string };
  department: { id: string; name: string };
  supervisor: { id: string; name: string } | null;
  keywords: { id: string; name: string }[];
  avgRating?: number | null;
  downloadCount?: number;
};

export type PublicWorkCard = {
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

export type SearchHit = PublicWorkCard & {
  highlight?: { title?: string[]; abstract?: string[]; keywords?: string[] };
};

export { WorkStatus, WorkType, Language, Role, Decision };
