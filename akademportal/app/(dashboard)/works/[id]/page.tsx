"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Calendar, Landmark, Globe, BookOpen, Download, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { WorkCard } from "@/components/works/WorkCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { CriteriaBar } from "@/components/ui/CriteriaBar";
import { PlagiarismBadge } from "@/components/ui/PlagiarismBadge";
import { ReviewForm } from "@/components/review/ReviewForm";
import { workTypeLabel, workStatusLabel, languageLabel } from "@/lib/work-labels";
import { useSession } from "next-auth/react";
import { apiJsonSafe } from "@/lib/fetcher";
import type { WorkType } from "@prisma/client";

type WorkDetailPayload = {
  work: {
    title: string;
    abstract: string;
    type: string;
    year: number;
    language: string;
    status: string;
    viewCount: number;
    pageCount: number | null;
    plagiarismScore: number | null;
    author: { name: string };
    faculty: { name: string };
    supervisor: { name: string } | null;
    keywords: { name: string }[];
    avgRating: number | null;
    reviews: {
      id: string;
      overallScore: number;
      relevance: number;
      methodology: number;
      formatting: number;
      conclusion: number;
      comment: string;
      reviewer: { name: string };
    }[];
  };
  similar: {
    id: string;
    title: string;
    abstract: string;
    type: WorkType;
    year: number;
    viewCount: number;
    downloads: number;
    authorName: string;
    facultyName: string;
    supervisorName: string | null;
    keywords: string[];
  }[];
};

export default function WorkDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { data: session } = useSession();
  const [data, setData] = useState<WorkDetailPayload | null>(null);

  useEffect(() => {
    apiJsonSafe<WorkDetailPayload | null>(`/api/works/${id}`, null).then(setData);
    fetch(`/api/works/${id}/view`, { method: "POST", credentials: "include" }).catch(() => undefined);
  }, [id]);

  async function download() {
    const j = await apiJsonSafe<{ url?: string }>(`/api/works/${id}/download`, {});
    if (j.url) window.open(j.url, "_blank");
  }

  async function toggleBookmark() {
    await fetch(`/api/bookmarks/${id}`, { method: "POST", credentials: "include" });
  }

  if (!data) return <div className="text-neutral-500">Жүктелуде…</div>;
  const w = data.work;

  return (
    <div className="max-w-7xl mx-auto -m-4 md:-m-8 px-4 md:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-12 flex-wrap">
        <Link href="/search" className="hover:text-primary">
          Іздеу
        </Link>
        <ChevronRight size={14} />
        <span className="text-neutral-900 font-medium line-clamp-1">{w.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="type">{workTypeLabel(w.type as never)}</Badge>
              <Badge variant="approved">{workStatusLabel(w.status as never)}</Badge>
              <PlagiarismBadge score={w.plagiarismScore} />
            </div>
            <h1 className="font-display text-4xl lg:text-5xl text-neutral-900 leading-tight">{w.title}</h1>
            <div className="flex items-center gap-4 py-4 border-y border-neutral-100">
              <Avatar
                initials={w.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
                size="lg"
              />
              <div>
                <div className="font-semibold text-neutral-900">{w.author.name}</div>
                <div className="text-sm text-neutral-500">
                  Ғылыми жетекші: {w.supervisor?.name ?? "—"}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-neutral-400" /> {w.year}
              </div>
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-neutral-400" /> {w.faculty.name}
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-neutral-400" /> {languageLabel(w.language as never)}
              </div>
              {w.pageCount && (
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-neutral-400" /> {w.pageCount} бет
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {w.keywords.map((k) => (
                <Badge key={k.name} variant="tag" className="px-3 py-1">
                  {k.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{w.abstract}</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button className="gap-2" type="button" onClick={download}>
              <Download size={18} /> Жүктеу
            </Button>
            <Button variant="secondary" type="button" className="gap-2" onClick={toggleBookmark}>
              <Bookmark size={18} /> Бетбелгі
            </Button>
          </div>

          {w.avgRating != null && (
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 flex items-center gap-6">
              <ScoreRing score={w.avgRating} size={56} strokeWidth={4} />
              <div>
                <div className="text-sm text-neutral-500">Орташа баға</div>
                <div className="text-2xl font-bold">{w.avgRating.toFixed(2)}</div>
              </div>
            </div>
          )}

          {w.reviews[0] && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Соңғы шолу</h3>
              <CriteriaBar label="Өзектілік" score={w.reviews[0].relevance} />
              <CriteriaBar label="Әдістеме" score={w.reviews[0].methodology} />
              <CriteriaBar label="Ресімдеу" score={w.reviews[0].formatting} />
              <CriteriaBar label="Қорытынды" score={w.reviews[0].conclusion} />
              <p className="text-sm text-neutral-600">{w.reviews[0].comment}</p>
            </div>
          )}

          {(session?.user?.role === "SUPERVISOR" || session?.user?.role === "ADMIN") && (
            <div className="border border-neutral-200 rounded-xl p-6 bg-white">
              <h3 className="text-lg font-semibold mb-4">Шолу жіберу</h3>
              <ReviewForm workId={id} onDone={() => window.location.reload()} />
            </div>
          )}
        </div>
      </div>

      <section className="mt-16 space-y-6">
        <h2 className="text-xl font-semibold">Ұқсас жұмыстар</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.similar.map((s) => (
            <WorkCard
              key={s.id}
              id={s.id}
              title={s.title}
              authorName={s.authorName}
              facultyName={s.facultyName}
              supervisorName={s.supervisorName}
              abstract={s.abstract}
              type={s.type}
              views={s.viewCount}
              downloads={s.downloads}
              year={s.year}
              tags={s.keywords}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
