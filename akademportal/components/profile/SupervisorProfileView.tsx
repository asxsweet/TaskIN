"use client";

import Link from "next/link";
import {
  Building2,
  ClipboardCheck,
  GraduationCap,
  Mail,
  Phone,
  Shield,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { A } from "@/lib/prisma-enums";
import { workTypeLabel } from "@/lib/work-labels";

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  faculty: { id: string; name: string };
  department: { id: string; name: string } | null;
  position: string | null;
  phone: string | null;
  employeeId: string | null;
  approvalStatus: string;
  approvedAt: string | null;
};

type Stats = {
  supervisedWorksCount: number;
  reviewsTotal: number;
  reviewsThisMonth: number;
  studentsCount: number;
  pendingQueue: number;
};

type RecentReview = {
  id: string;
  title: string;
  type: string;
  studentName: string;
  workId: string;
  overallScore: number;
  decision: string;
  createdAt: string;
};

const decisionKz: Record<string, string> = {
  APPROVE: "Мақұлдау",
  RETURN: "Қайтару",
  REJECT: "Қабылдамау",
};

export function SupervisorProfileView({
  profile,
  stats,
  recentReviews,
}: {
  profile: Profile;
  stats: Stats;
  recentReviews: RecentReview[];
}) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const pendingApproval = profile.approvalStatus === A.PENDING;

  return (
    <div className="max-w-4xl mx-auto space-y-8 -m-4 md:-m-8 px-4 md:px-8 py-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-900 text-white p-6 md:p-8 shadow-lg">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end gap-6">
          <Avatar src={profile.avatar} initials={initials} size="lg" className="ring-4 ring-white/25 h-20 w-20 text-lg" />
          <div className="flex-1 min-w-0">
            <p className="text-violet-100 text-sm font-medium">Жетекші кабинеті</p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">{profile.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-violet-100">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={14} />
                {profile.email}
              </span>
              {profile.phone ?
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} />
                  {profile.phone}
                </span>
              : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold">Ғылыми жетекші</span>
              {pendingApproval ?
                <span className="rounded-full bg-amber-400/30 px-3 py-0.5 text-xs font-semibold text-amber-100">
                  Әкімші мақұлдауы күтілуде
                </span>
              : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Link
              href="/supervisor/settings"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                "bg-white/95 text-violet-900 shadow-sm hover:bg-white"
              )}
            >
              Баптаулар
            </Link>
            <Link
              href="/supervisor/assigned"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                "border border-white/40 bg-white/15 text-white hover:bg-white/25"
              )}
            >
              Тексеру кезегі
            </Link>
          </div>
        </div>
      </section>

      {pendingApproval ?
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 flex gap-3 items-start">
          <Shield className="shrink-0 mt-0.5" size={18} />
          <p>
            Аккаунтыңыз әлі толық белсенді емес: әкімші мақұлдағаннан кейін барлық функциялар ашылады. Статусты{" "}
            <strong>хабарландырулар</strong> немесе әкіммен байланысып біліңіз.
          </p>
        </div>
      : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <Building2 size={14} />
            Орын
          </h3>
          <p className="font-medium text-neutral-900">{profile.faculty.name}</p>
          <p className="text-sm text-neutral-600">
            Кафедра: <span className="font-medium text-neutral-800">{profile.department?.name ?? "—"}</span>
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <UserCircle size={14} />
            Қызметі
          </h3>
          <p className="font-medium text-neutral-900">{profile.position ?? "—"}</p>
          <p className="text-sm text-neutral-600">
            Қызметтік №:{" "}
            <span className="font-mono font-medium text-neutral-800">{profile.employeeId ?? "—"}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
          <p className="text-xs font-semibold text-violet-800 uppercase">Бақыланған жұмыс</p>
          <p className="mt-1 text-3xl font-bold text-violet-700">{stats.supervisedWorksCount}</p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
          <p className="text-xs font-semibold text-indigo-800 uppercase">Берілген пікір</p>
          <p className="mt-1 text-3xl font-bold text-indigo-700">{stats.reviewsTotal}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <p className="text-xs font-semibold text-emerald-800 uppercase">Осы ай</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">{stats.reviewsThisMonth}</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 uppercase">
            <ClipboardCheck size={14} />
            Кезекте
          </div>
          <p className="mt-1 text-3xl font-bold text-amber-700">{stats.pendingQueue}</p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-gradient-to-r from-neutral-50 to-white p-4 flex flex-wrap items-center gap-4">
        <GraduationCap className="text-violet-600" size={28} />
        <div>
          <p className="text-sm font-semibold text-neutral-900">Бағытталған студенттер</p>
          <p className="text-2xl font-bold text-violet-700">{stats.studentsCount}</p>
        </div>
        <Link
          href="/supervisor/students"
          className="ml-auto text-sm font-medium text-violet-700 hover:underline"
        >
          Тізімге өту →
        </Link>
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Соңғы пікірлер</h2>
          <Link href="/supervisor/history" className="text-sm text-violet-700 hover:underline">
            Тарих
          </Link>
        </div>
        {recentReviews.length === 0 ?
          <div className="px-5 py-10 text-center text-neutral-500 text-sm">
            Әлі берілген пікір жоқ.{" "}
            <Link href="/supervisor/assigned" className="text-violet-700 font-medium hover:underline">
              Кезектегі жұмыстарды ашыңыз
            </Link>
          </div>
        : <ul className="divide-y divide-neutral-100">
            {recentReviews.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/supervisor/review/${r.workId}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 px-5 py-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{r.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {r.studentName} · {workTypeLabel(r.type as never)} · {decisionKz[r.decision] ?? r.decision}
                    </p>
                  </div>
                  <div className="text-xs text-neutral-500 shrink-0">
                    Баға: {r.overallScore.toFixed(1)} · {new Date(r.createdAt).toLocaleDateString("kk-KZ")}
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
