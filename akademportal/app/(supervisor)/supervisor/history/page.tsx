"use client";

import { useEffect, useState } from "react";
import { apiJsonSafe } from "@/lib/fetcher";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SupervisorHistoryPage() {
  const [rows, setRows] = useState<
    {
      id: string;
      studentName: string;
      title: string;
      type: string;
      score: number;
      decision: string;
      createdAt: string;
      facultyName: string;
    }[]
  >([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    apiJsonSafe(`/api/supervisor/history?page=${page}&limit=15`, { items: [], total: 0 }).then((d: { items?: typeof rows; total?: number }) => {
      setRows(d.items ?? []);
      setTotal(d.total ?? 0);
    });
  }, [page]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Тексеру тарихы</h1>
      {rows.length === 0 ?
        <EmptyState title="Тексеру тарихы жоқ" />
      : (
        <>
          <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-left">
                  <th className="p-3">Студент</th>
                  <th className="p-3">Тақырып</th>
                  <th className="p-3">Түрі</th>
                  <th className="p-3">Балл</th>
                  <th className="p-3">Шешім</th>
                  <th className="p-3">Күні</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-100">
                    <td className="p-3">{r.studentName}</td>
                    <td className="p-3 max-w-[200px] truncate">{r.title}</td>
                    <td className="p-3">{r.type}</td>
                    <td className="p-3">{r.score}</td>
                    <td className="p-3">{r.decision}</td>
                    <td className="p-3 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString("kk-KZ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 items-center">
        <button
          type="button"
          disabled={page <= 1}
          className="text-sm text-blue-600 disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Артқа
        </button>
        <span className="text-sm text-neutral-500">
          Бет {page} · барлығы {total}
        </span>
        <button
          type="button"
          disabled={page * 15 >= total}
          className="text-sm text-blue-600 disabled:opacity-40"
          onClick={() => setPage((p) => p + 1)}
        >
          Алға
        </button>
      </div>
        </>
      )}
    </div>
  );
}
