"use client";

import { useEffect, useState } from "react";
import { apiJsonSafe } from "@/lib/fetcher";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";

export default function SupervisorStudentsPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<
    {
      id: string;
      name: string;
      email: string;
      facultyName: string;
      worksCount: number;
      avgScore: number | null;
      works: { id: string; title: string; status: string }[];
    }[]
  >([]);

  useEffect(() => {
    const t = setTimeout(() => {
      const url = q.trim() ? `/api/supervisor/students?q=${encodeURIComponent(q.trim())}` : "/api/supervisor/students";
      apiJsonSafe<{ items?: typeof items }>(url, { items: [] }).then((d) => setItems(d.items ?? []));
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Студенттерім</h1>
      <Input placeholder="Студент іздеу..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />
      {items.length === 0 ?
        <EmptyState title="Сізге бекітілген студенттер жоқ" />
      : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((s) => (
          <div key={s.id} className="rounded-lg border border-neutral-200 bg-white p-4 space-y-2">
            <div className="font-semibold">{s.name}</div>
            <div className="text-xs text-neutral-500">{s.email}</div>
            <div className="text-xs inline-block rounded-full bg-neutral-100 px-2 py-0.5">{s.facultyName ?? "—"}</div>
            <div className="text-sm">
              Жұмыс: {s.worksCount} · Орташа: {s.avgScore ?? "—"}
            </div>
            <ul className="text-xs space-y-1">
              {s.works.map((w) => (
                <li key={w.id} className="truncate">
                  {w.title} — {w.status}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
