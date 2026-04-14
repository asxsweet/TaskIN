"use client";

import Link from "next/link";
import {
  BookMarked,
  BookOpen,
  Eye,
  FileText,
  Mail,
  School,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { workTypeLabel } from "@/lib/work-labels";

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  faculty: { id: string; name: string };
  department: { id: string; name: string } | null;
};

type Stats = {
  worksTotal: number;
  worksApproved: number;
  worksPending: number;
  worksReturned: number;
  bookmarkCount: number;
  totalViews: number;
};

type Recent = {
  id: string;
  title: string;
  type: string;
  status: string;
  year: number;
  viewCount: number;
  createdAt: string;
};

const statusKz: Record<string, string> = {
  PENDING: "Тексеруде",
  APPROVED: "Жарияланған",
  RETURNED: "Түзетуге",
  REJECTED: "Қабылданбаған",
};

export function StudentProfileView({
  profile,
  stats,
  recentWorks,
}: {
  profile: Profile;
  stats: Stats;
  recentWorks: Recent[];
}) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 -m-4 md:-m-8 px-4 md:px-8 py-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 md:p-8 shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-end gap-6">
          <Avatar src={profile.avatar} initials={initials} size="lg" className="ring-4 ring-white/30 h-20 w-20 text-lg" />
          <div className="flex-1 min-w-0">
            <p className="text-blue-100 text-sm font-medium">Жеке кабинет</p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">{profile.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-blue-100">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={14} />
                {profile.email}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold">Студент</span>
              <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs">
                Тіркелген: {new Date(profile.createdAt).toLocaleDateString("kk-KZ")}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link
              href="/settings"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                "bg-white/95 text-blue-900 shadow-sm hover:bg-white"
              )}
            >
              Баптаулар
            </Link>
            <Link
              href="/upload"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                "border border-white/40 bg-white/15 text-white hover:bg-white/25"
              )}
            >
              Жұмыс жүктеу
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-wide">
            <School size={14} />
            Факультет
          </div>
          <p className="mt-2 font-semibold text-neutral-900">{profile.faculty.name}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-wide">
            <Sparkles size={14} />
            Кафедра
          </div>
          <p className="mt-2 font-semibold text-neutral-900">{profile.department?.name ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-wide">
            <FileText size={14} />
            Жұмыстар
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">{stats.worksTotal}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-wide">
            <Eye size={14} />
            Қаралымдар
          </div>
          <p className="mt-2 text-2xl font-bold text-indigo-600">{stats.totalViews}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
          <p className="text-xs font-semibold text-emerald-800 uppercase">Мақұлданған</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">{stats.worksApproved}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
          <p className="text-xs font-semibold text-amber-900 uppercase">Тексеруде</p>
          <p className="mt-1 text-3xl font-bold text-amber-700">{stats.worksPending}</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50/80 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-900 uppercase">
            <BookMarked size={14} />
            Жинақта
          </div>
          <p className="mt-1 text-3xl font-bold text-violet-700">{stats.bookmarkCount}</p>
        </div>
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" />
            Соңғы жұмыстарым
          </h2>
          <Link href="/my-works" className="text-sm text-blue-600 hover:underline">
            Барлығы
          </Link>
        </div>
        {recentWorks.length === 0 ?
          <div className="px-5 py-10 text-center text-neutral-500 text-sm">
            Әлі жүктелген жұмыс жоқ.{" "}
            <Link href="/upload" className="text-blue-600 font-medium hover:underline">
              Алғашқы жұмысты жүктеңіз
            </Link>
          </div>
        : <ul className="divide-y divide-neutral-100">
            {recentWorks.map((w) => (
              <li key={w.id}>
                <Link
                  href={`/works/${w.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 px-5 py-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{w.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {workTypeLabel(w.type as never)} · {w.year} · {statusKz[w.status] ?? w.status}
                    </p>
                  </div>
                  <div className="text-xs text-neutral-400 shrink-0">
                    {w.viewCount} қаралым · {new Date(w.createdAt).toLocaleDateString("kk-KZ")}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        }
      </section>
    </div>
  );
}
