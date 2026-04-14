"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { ReviewForm } from "@/components/review/ReviewForm";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { workTypeLabel } from "@/lib/work-labels";
import type { WorkType, WorkStatus, Language } from "@prisma/client";

type WorkPayload = {
  id: string;
  title: string;
  abstract: string;
  type: WorkType;
  year: number;
  language: Language;
  status: WorkStatus;
  author: { id: string; name: string; email?: string; faculty?: { name: string } };
  faculty?: { name: string };
  keywords: { name: string }[];
};

export default function SupervisorReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const [work, setWork] = useState<WorkPayload | "loading" | null>("loading");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/works/${id}`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Жүктелмеді");
        return r.json();
      })
      .then((d: { work?: WorkPayload }) => {
        if (!cancelled) setWork(d.work ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setErr("Жұмысты жүктеу сәтсіз");
          setWork(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
        <p className="text-red-600">{err}</p>
      </div>
    );
  }

  if (work === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-500">
        Жүктелуде…
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p>Табылмады</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="h-14 shrink-0 border-b border-neutral-200 bg-white flex items-center justify-between px-4 sticky top-0 z-50">
        <Link href="/supervisor/assigned" className="text-sm text-blue-600 font-medium">
          ← Кері
        </Link>
        <span className="text-sm font-semibold truncate max-w-[min(50vw,320px)] text-center px-2">{work.title}</span>
        <span className="text-sm text-neutral-600 truncate max-w-[120px] hidden sm:block">{work.author.name}</span>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <section className="lg:w-[60%] overflow-y-auto p-6 border-b lg:border-b-0 lg:border-r border-neutral-200">
          <h2 className="text-lg font-semibold mb-2">{work.title}</h2>
          <div className="flex flex-wrap gap-2 text-xs text-neutral-500 mb-4">
            <span>{workTypeLabel(work.type)}</span>
            <span>·</span>
            <span>{work.year}</span>
            <span>·</span>
            <span>{work.language}</span>
            <span>·</span>
            <span>{work.status}</span>
          </div>
          <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed mb-4">{work.abstract}</p>
          {work.keywords?.length ?
            <div className="flex flex-wrap gap-2 mb-6">
              {work.keywords.map((k) => (
                <span key={k.name} className="text-xs bg-neutral-100 px-2 py-1 rounded">
                  {k.name}
                </span>
              ))}
            </div>
          : null}

          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500 mb-4">
            PDF алдын ала қарау орны
          </div>
          <a href={`/api/works/${id}/download`} target="_blank" rel="noreferrer">
            <Button type="button" variant="secondary" className="gap-2">
              <Download size={18} />
              PDF жүктеу
            </Button>
          </a>
        </section>

        <aside className="lg:w-[40%] lg:sticky lg:top-14 lg:self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-neutral-50 lg:bg-white border-t lg:border-t-0 border-neutral-200 p-6">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 mb-6 flex gap-3">
            <Avatar
              initials={work.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
              size="md"
            />
            <div className="min-w-0 text-sm">
              <div className="font-semibold">{work.author.name}</div>
              <div className="text-neutral-500 truncate">{work.author.faculty?.name ?? work.faculty?.name}</div>
            </div>
          </div>

          <ReviewForm workId={id} onDone={() => router.push("/supervisor/assigned")} />
        </aside>
      </div>
    </div>
  );
}
