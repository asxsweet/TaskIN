"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { ActivitySparkline } from "@/components/charts/ActivitySparkline";
import { apiJsonSafe } from "@/lib/fetcher";

export default function SupervisorHomePage() {
  const { data, status } = useSession();
  const [s, setS] = useState<{
    pendingCount: number;
    reviewedThisMonth: number;
    avgScore: number | null;
    studentsCount: number;
    urgentWorks: { id: string; title: string; studentName: string; daysWaiting: number }[];
    recentReviews: {
      id: string;
      studentName: string;
      title: string;
      score: number;
      decision: string;
      createdAt: string;
    }[];
    activityLast30Days: { date: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    apiJsonSafe("/api/supervisor/stats", null).then(setS);
  }, [status]);

  if (!s) {
    return <div className="text-neutral-500">Жүктелуде…</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-blue-600 text-white p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">
            Сәлем, {data?.user?.name?.split(" ")[0]}!
            {s.pendingCount === 0 ?
              " Тексеретін жұмыс жоқ 🎉"
            : ` Сізде ${s.pendingCount} жұмыс күтуде`}
          </h1>
        </div>
        {s.pendingCount > 0 ?
          <Link href="/supervisor/assigned">
            <Button variant="secondary" className="bg-white text-blue-700 border-0">
              Тексеруге өту →
            </Button>
          </Link>
        : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Тексеруде", value: s.pendingCount, tone: s.pendingCount > 0 ? "amber" : "gray" },
          { label: "Осы айда", value: s.reviewedThisMonth, tone: "neutral" },
          { label: "Орташа баллым", value: s.avgScore != null ? `${s.avgScore} ★` : "—", tone: "neutral" },
          { label: "Студенттерім", value: s.studentsCount, tone: "neutral" },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="text-xs text-neutral-500 mb-1">{c.label}</div>
            <div
              className={`text-2xl font-bold ${
                c.tone === "amber" ? "text-amber-600"
                : c.tone === "gray" ? "text-neutral-400"
                : "text-neutral-900"
              }`}
            >
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {s.urgentWorks.length > 0 ?
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
          <div className="font-semibold text-red-900">
            ⚠ {s.urgentWorks.length} жұмыс 7+ күн тексерілмей тұр
          </div>
          <ul className="space-y-2">
            {s.urgentWorks.map((u) => (
              <li key={u.id} className="flex justify-between gap-2 text-sm">
                <span>
                  {u.title} — {u.studentName} ({u.daysWaiting} күн)
                </span>
                <Link href={`/supervisor/review/${u.id}`} className="text-blue-600 font-medium shrink-0">
                  Дәл қазір →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Соңғы бағалаулар</h2>
          <div className="overflow-x-auto text-sm">
            <table className="w-full">
              <thead>
                <tr className="text-left text-neutral-500 border-b">
                  <th className="pb-2">Студент</th>
                  <th className="pb-2">Тақырып</th>
                  <th className="pb-2">Балл</th>
                  <th className="pb-2">Шешім</th>
                </tr>
              </thead>
              <tbody>
                {s.recentReviews.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-50">
                    <td className="py-2">{r.studentName}</td>
                    <td className="py-2 max-w-[140px] truncate">{r.title}</td>
                    <td className="py-2">{r.score}</td>
                    <td className="py-2">{r.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Белсенділік (30 күн)</h2>
          <ActivitySparkline points={s.activityLast30Days} />
        </div>
      </div>
    </div>
  );
}
