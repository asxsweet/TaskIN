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
  createdAt: string;
};

export default function AdminReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [exporting, setExporting] = useState(false);

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
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="text-xs text-neutral-500 uppercase">Барлық жұмыстар</div>
          <div className="text-2xl font-bold mt-1">{stats.totalWorks}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="text-xs text-neutral-500 uppercase">Осы айдағы жүктелулер</div>
          <div className="text-2xl font-bold mt-1">{stats.monthDownloads}</div>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Факультеттер бойынша</h2>
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-neutral-50 text-left">
                <th className="p-3">Факультет</th>
                <th className="p-3">Жұмыс саны</th>
              </tr>
            </thead>
            <tbody>
              {stats.facultyStats.map((f) => (
                <tr key={f.id} className="border-b border-neutral-100">
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
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <ActivitySparkline points={stats.activityLast30} />
        </div>
      </section>
    </div>
  );
}
