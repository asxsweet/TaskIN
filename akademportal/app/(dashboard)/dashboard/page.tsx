"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Download, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WorkCard } from "@/components/works/WorkCard";
import { useSession } from "next-auth/react";
import { formatNumber } from "@/lib/utils";
import { workTypeLabel, workStatusLabel } from "@/lib/work-labels";
import type { WorkStatus, WorkType } from "@prisma/client";
import { apiJsonSafe } from "@/lib/fetcher";
import { EmptyState } from "@/components/ui/EmptyState";
import { StarRating } from "@/components/ui/StarRating";

type StatsPayload = {
  myWorksCount: number;
  approvedCount: number;
  pendingCount: number;
  totalDownloads: number;
  totalViews: number;
  avgRating: number | null;
  recentWorks: {
    id: string;
    title: string;
    type: WorkType;
    status: WorkStatus;
    createdAt: string;
    score: number | null;
    supervisorName: string | null;
  }[];
  notifications: { id: string; title: string; body: string | null; read: boolean }[];
  recommendedWorks: {
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

const EMPTY_STUDENT_STATS: StatsPayload = {
  myWorksCount: 0,
  approvedCount: 0,
  pendingCount: 0,
  totalDownloads: 0,
  totalViews: 0,
  avgRating: null,
  recentWorks: [],
  notifications: [],
  recommendedWorks: [],
};

export default function DashboardPage() {
  const { data } = useSession();
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    apiJsonSafe<StatsPayload>("/api/student/stats", EMPTY_STUDENT_STATS)
      .then((s) => setStats(s))
      .catch(() => setErr("Деректер жүктелмеді"));
  }, []);

  if (err) {
    return <div className="text-neutral-500 text-sm">{err}</div>;
  }

  if (stats === null) {
    return <div className="text-neutral-500 text-sm">Жүктелуде…</div>;
  }

  const empty = stats.myWorksCount === 0;

  return (
    <div className="space-y-8">
      <section className="bg-primary rounded-xl p-8 relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center gap-4 flex-wrap">
          <div className="text-white">
            <h1 className="text-2xl font-semibold mb-2">Сәлем, {data?.user?.name?.split(" ")[0] ?? "қолданушы"}! 👋</h1>
            <p className="text-white/70 text-sm max-w-md">Сіздің жұмыстарыңызды белсенді қолданушылар қарап жатыр.</p>
          </div>
          <Link href="/upload">
            <Button variant="secondary" className="bg-white text-primary border-none hover:bg-neutral-50">
              Жаңа жүктеу <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
      </section>

      {stats.pendingCount > 0 ?
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          ⏳ {stats.pendingCount} жұмысыңыз тексеруде
        </div>
      : null}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Жұмыстарым",
            value: formatNumber(stats.myWorksCount),
            icon: FileText,
            tone: "neutral",
          },
          {
            label: "Бекітілді",
            value: formatNumber(stats.approvedCount),
            icon: CheckCircle2,
            tone: "teal",
          },
          {
            label: "Тексеруде",
            value: formatNumber(stats.pendingCount),
            icon: Clock,
            tone: "amber",
          },
          {
            label: "Жүктелулер",
            value: formatNumber(stats.totalDownloads),
            icon: Download,
            tone: "neutral",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</span>
              <stat.icon
                size={18}
                className={
                  stat.tone === "teal" ? "text-teal-500"
                  : stat.tone === "amber" ? "text-amber-500"
                  : "text-neutral-300"
                }
              />
            </div>
            <span className="text-2xl font-bold text-neutral-900">{stat.value}</span>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Соңғы жұмыстар</h2>
            <Link href="/my-works" className="text-sm text-primary hover:underline">
              Барлығын қарау
            </Link>
          </div>
          {empty ?
            <EmptyState
              title="Сізде әлі жұмыс жоқ"
              actionLabel="Алғашқы жұмысты жүктеу →"
              actionHref="/upload"
            />
          : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                    <th className="pb-4 font-bold">Тақырып</th>
                    <th className="pb-4 font-bold">Түрі</th>
                    <th className="pb-4 font-bold">Статус</th>
                    <th className="pb-4 font-bold">Күні</th>
                    <th className="pb-4 font-bold">Балл</th>
                    <th className="pb-4 font-bold">Әрекет</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {stats.recentWorks.map((row) => (
                    <tr key={row.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                      <td className="py-4 font-medium text-neutral-900 max-w-[180px] truncate">{row.title}</td>
                      <td className="py-4 text-neutral-500">{workTypeLabel(row.type)}</td>
                      <td className="py-4">
                        <Badge
                          variant={
                            row.status === "APPROVED" ? "approved"
                            : row.status === "PENDING" ? "pending"
                            : "rejected"
                          }
                        >
                          {workStatusLabel(row.status)}
                        </Badge>
                      </td>
                      <td className="py-4 text-neutral-400 whitespace-nowrap">
                        {new Date(row.createdAt).toLocaleDateString("kk-KZ")}
                      </td>
                      <td className="py-4">
                        {row.score != null ?
                          <StarRating value={Math.round(row.score)} readOnly />
                        : (
                          "—"
                        )}
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <Link href={`/works/${row.id}`} className="text-primary text-xs font-medium mr-2">
                          Қарау
                        </Link>
                        {row.status === "PENDING" ?
                          <Link href="/upload" className="text-neutral-500 text-xs">
                            Өңдеу
                          </Link>
                        : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ұсынылатын жұмыстар</h2>
          <Link href="/search" className="text-sm text-primary hover:underline">
            Барлығы →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.recommendedWorks.length === 0 ?
            <p className="text-sm text-neutral-500 col-span-full">Ұсыныстар әлі жоқ — іздеуден қараңыз.</p>
          : null}
          {stats.recommendedWorks.map((w) => (
            <WorkCard
              key={w.id}
              id={w.id}
              title={w.title}
              authorName={w.authorName}
              facultyName={w.facultyName}
              supervisorName={w.supervisorName}
              abstract={w.abstract}
              type={w.type}
              views={w.viewCount}
              downloads={w.downloads}
              year={w.year}
              tags={w.keywords}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
