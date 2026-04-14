"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FacultyBars } from "@/components/charts/FacultyBars";
import { TypeDonut } from "@/components/charts/TypeDonut";
import { ActivitySparkline } from "@/components/charts/ActivitySparkline";
import { WorkTable, type WorkTableRow } from "@/components/works/WorkTable";
import { Button } from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";
import { apiJsonSafe } from "@/lib/fetcher";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

type AdminStats = {
  totalWorks: number;
  totalUsers: number;
  totalStudents: number;
  totalSupervisors: number;
  pendingWorks: number;
  pendingApprovals: number;
  todayUploads: number;
  monthDownloads: number;
  facultyStats: { id: string; name: string; worksCount: number }[];
  typeStats: { type: string; count: number; percent: number }[];
  activityLast30: { date: string; count: number }[];
};

const emptyStats: AdminStats = {
  totalWorks: 0,
  totalUsers: 0,
  totalStudents: 0,
  totalSupervisors: 0,
  pendingWorks: 0,
  pendingApprovals: 0,
  todayUploads: 0,
  monthDownloads: 0,
  facultyStats: [],
  typeStats: [],
  activityLast30: [],
};

export default function AdminHomePage() {
  const [dash, setDash] = useState<AdminStats | null>(null);
  const [pendingRows, setPendingRows] = useState<WorkTableRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const d = await apiJsonSafe<AdminStats>("/api/admin/stats", emptyStats);
      const w = await apiJsonSafe<{
        items?: {
          id: string;
          title: string;
          type: WorkTableRow["type"];
          status: WorkTableRow["status"];
          createdAt: string;
          author: { name: string };
          faculty: { name: string };
        }[];
      }>("/api/works?status=PENDING&limit=10", { items: [] });
      if (cancelled) return;
      setDash(d);
      setPendingRows(
        (w.items ?? []).map((x) => ({
          id: x.id,
          title: x.title,
          type: x.type,
          status: x.status,
          createdAt: x.createdAt,
          author: x.author.name,
          faculty: x.faculty.name,
        }))
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!dash) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const kpis = [
    { label: "Барлық жұмыстар", value: formatNumber(dash.totalWorks) },
    { label: "Пайдаланушылар", value: formatNumber(dash.totalUsers) },
    { label: "Бүгін жүктелді", value: formatNumber(dash.todayUploads) },
    { label: "Тексеруде", value: formatNumber(dash.pendingWorks) },
    { label: "Айлық жүктеу (сан)", value: formatNumber(dash.monthDownloads) },
  ];

  const typeTotal = dash.typeStats.reduce((s, t) => s + t.count, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">{kpi.label}</div>
            <div className="text-2xl font-bold text-neutral-900">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 mb-6">Факультет бойынша жұмыстар</h3>
          {dash.facultyStats.length === 0 ?
            <EmptyState title="Деректер жоқ" description="Факультет пен жұмыс қосылғанда көрінеді." />
          : <FacultyBars rows={dash.facultyStats} />}
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 mb-6">Жұмыс түрлері</h3>
          {typeTotal === 0 ?
            <EmptyState title="Деректер жоқ" />
          : <TypeDonut types={dash.typeStats} total={typeTotal} />}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 mb-6">Белсенділік (30 күн)</h3>
        <ActivitySparkline points={dash.activityLast30} />
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">Тексеру кезегі</h3>
          <Link href="/admin/works">
            <Button variant="ghost" size="sm">
              Барлығын қарау
            </Button>
          </Link>
        </div>
        {pendingRows.length === 0 ?
          <div className="p-8">
            <EmptyState title="Тексерілетін жұмыстар жоқ" />
          </div>
        : <WorkTable rows={pendingRows} />}
      </div>
    </div>
  );
}
