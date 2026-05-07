"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ActivitySparkline } from "@/components/charts/ActivitySparkline";
import { apiJsonSafe } from "@/lib/fetcher";

type Stats = {
  facultyStats: { id: string; name: string; worksCount: number }[];
  activityLast30: { date: string; count: number }[];
  totalWorks: number;
  monthDownloads: number;
};

type WorkRow = {
  id: string;
  title: string;
  authorName: string;
  facultyName: string;
  type: string;
  status: string;
  moderationFlag?: boolean;
  createdAt: string;
};

type Health = {
  status?: string;
  checks?: { db?: { ok?: boolean; latencyMs?: number }; elasticsearch?: { ok?: boolean; latencyMs?: number } };
};
type Audit = { id: string; action: string; entity: string; actorName: string | null; createdAt: string };

export default function AdminReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [exporting, setExporting] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const [audit, setAudit] = useState<Audit[]>([]);

  useEffect(() => {
    apiJsonSafe<Stats>("/api/admin/stats", {
      facultyStats: [],
      activityLast30: [],
      totalWorks: 0,
      monthDownloads: 0,
    }).then((s) =>
      setStats({
        facultyStats: s.facultyStats ?? [],
        activityLast30: s.activityLast30 ?? [],
        totalWorks: s.totalWorks ?? 0,
        monthDownloads: s.monthDownloads ?? 0,
      })
    );
  }, []);
  useEffect(() => {
    apiJsonSafe<Health>("/api/health", {}).then((d) => setHealth(d));
    apiJsonSafe<{ items?: Audit[] }>("/api/admin/audit?limit=8", { items: [] }).then((d) =>
      setAudit(d.items ?? [])
    );
  }, []);

  async function exportCsv() {
    setExporting(true);
    try {
      const r = await fetch("/api/admin/works?limit=5000&page=1", { credentials: "include" });
      const j = (await r.json()) as { items?: WorkRow[] };
      const rows = j.items ?? [];
      const header = ["id", "title", "author", "faculty", "type", "status", "createdAt"];
      const lines = [
        header.join(","),
        ...rows.map((w) =>
          [w.id, w.title, w.authorName, w.facultyName, w.type, w.status, w.createdAt]
            .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
            .join(",")
        ),
      ];
      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `task-in-works-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  if (!stats) {
    return <div className="text-neutral-500">Жүктелуде…</div>;
  }

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Есептер</h1>
        <Button type="button" variant="secondary" className="gap-2" disabled={exporting} onClick={() => exportCsv()}>
          <Download size={18} />
          {exporting ? "Дайындалуда…" : "CSV экспорт"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 uppercase dark:text-neutral-400">Барлық жұмыстар</div>
          <div className="text-2xl font-bold mt-1">{stats.totalWorks}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 uppercase dark:text-neutral-400">Осы айдағы жүктелулер</div>
          <div className="text-2xl font-bold mt-1">{stats.monthDownloads}</div>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Факультеттер бойынша</h2>
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-neutral-50 text-left dark:border-neutral-700 dark:bg-neutral-800">
                <th className="p-3">Факультет</th>
                <th className="p-3">Жұмыс саны</th>
              </tr>
            </thead>
            <tbody>
              {stats.facultyStats.map((f) => (
                <tr key={f.id} className="border-b border-neutral-100 dark:border-neutral-800">
                  <td className="p-3">{f.name}</td>
                  <td className="p-3 font-medium">{f.worksCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Айлық жүктеу белсенділігі (30 күн)</h2>
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
          <ActivitySparkline points={stats.activityLast30} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold mb-3">Жүйе денсаулығы</h2>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Жалпы статус: {health?.status ?? "unknown"}
          </div>
          <div className="mt-2 text-xs">
            DB: {health?.checks?.db?.ok ? "ok" : "fail"} ({health?.checks?.db?.latencyMs ?? "-"} ms)
          </div>
          <div className="text-xs">
            ES: {health?.checks?.elasticsearch?.ok ? "ok" : "fail"} ({health?.checks?.elasticsearch?.latencyMs ?? "-"} ms)
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
          <h2 className="text-sm font-semibold mb-3">Соңғы audit log</h2>
          <div className="space-y-2">
            {audit.map((a) => (
              <div key={a.id} className="text-xs border-b border-neutral-100 pb-2 dark:border-neutral-800">
                <div className="font-medium">{a.action}</div>
                <div className="text-neutral-500 dark:text-neutral-400">{a.entity} · {a.actorName ?? "system"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
