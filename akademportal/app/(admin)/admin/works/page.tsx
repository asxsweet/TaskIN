"use client";

import { useCallback, useEffect, useState } from "react";
import { apiJsonSafe } from "@/lib/fetcher";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { workStatusLabel, workTypeLabel } from "@/lib/work-labels";

export default function AdminWorksPage() {
  const [rows, setRows] = useState<
    {
      id: string;
      title: string;
      type: string;
      status: string;
      createdAt: string;
      authorName: string;
      facultyName: string;
      moderationFlag: boolean;
    }[]
  >([]);
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const load = useCallback(async () => {
    const query = flaggedOnly ? "/api/admin/works?limit=100&flagged=true" : "/api/admin/works?limit=100";
    const d = await apiJsonSafe<{ items?: unknown[] }>(query, { items: [] });
    setRows((d.items ?? []) as typeof rows);
  }, [flaggedOnly]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleFlag(id: string, moderationFlag: boolean) {
    const r = await fetch(`/api/admin/works/${id}/flag`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moderationFlag: !moderationFlag }),
    });
    if (!r.ok) return;
    setRows((prev) => prev.map((w) => (w.id === id ? { ...w, moderationFlag: !moderationFlag } : w)));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Барлық жұмыстар</h1>
        <Button variant="secondary" type="button" onClick={() => setFlaggedOnly((v) => !v)}>
          {flaggedOnly ? "Барлығын көрсету" : "Тек белгіленген"}
        </Button>
      </div>
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 border-b border-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-500">
                <th className="px-6 py-4">Тақырып</th>
                <th className="px-6 py-4">Автор</th>
                <th className="px-6 py-4">Факультет</th>
                <th className="px-6 py-4">Түрі</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4">Moderation</th>
                <th className="px-6 py-4">Күні</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-neutral-50 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800">
                  <td className="px-6 py-4 font-medium">{row.title}</td>
                  <td className="px-6 py-4">{row.authorName}</td>
                  <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{row.facultyName}</td>
                  <td className="px-6 py-4">{workTypeLabel(row.type as never)}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        row.status === "APPROVED" ? "approved"
                        : row.status === "PENDING" ? "pending"
                        : "rejected"
                      }
                    >
                      {workStatusLabel(row.status as never)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => toggleFlag(row.id, row.moderationFlag)}
                      className={`rounded-full border px-2 py-1 text-xs ${
                        row.moderationFlag
                          ? "border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
                          : "border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"
                      }`}
                    >
                      {row.moderationFlag ? "Белгі бар" : "Белгілеу"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 dark:text-neutral-500">
                    {new Date(row.createdAt).toLocaleDateString("kk-KZ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
