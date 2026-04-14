"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiJsonSafe } from "@/lib/fetcher";
import { EmptyState } from "@/components/ui/EmptyState";

type Row = {
  id: string;
  title: string;
  daysWaiting: number;
  bucket: string;
  student: { name: string; email: string; facultyName: string };
};

export default function SupervisorAssignedPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [tab, setTab] = useState<"all" | "new" | "wait" | "late">("all");

  useEffect(() => {
    apiJsonSafe<{ items?: Row[] }>("/api/supervisor/assigned", { items: [] }).then((d) =>
      setItems(d.items ?? [])
    );
  }, []);

  const filtered =
    tab === "all" ? items
    : tab === "new" ? items.filter((i) => i.bucket === "new")
    : tab === "wait" ? items.filter((i) => i.bucket === "wait")
    : items.filter((i) => i.bucket === "late");

  const counts = {
    all: items.length,
    new: items.filter((i) => i.bucket === "new").length,
    wait: items.filter((i) => i.bucket === "wait").length,
    late: items.filter((i) => i.bucket === "late").length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Тексеру кезегі</h1>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "Барлығы", counts.all, "neutral"],
            ["new", "Жаңа <3күн", counts.new, "teal"],
            ["wait", "Күтуде 3-7күн", counts.wait, "amber"],
            ["late", "Кешіккен >7күн", counts.late, "red"],
          ] as const
        ).map(([k, label, n, tone]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`rounded-full px-4 py-2 text-sm font-medium border ${
              tab === k ? "border-blue-600 bg-blue-50 text-blue-800" : "border-neutral-200 bg-white"
            } ${tone === "teal" && tab === k ? "border-teal-600 bg-teal-50" : ""} ${
              tone === "amber" && tab === k ? "border-amber-500 bg-amber-50" : ""
            } ${tone === "red" && tab === k ? "border-red-500 bg-red-50" : ""}`}
          >
            {label} ({n})
          </button>
        ))}
      </div>
      {items.length === 0 ?
        <EmptyState
          title="Тексеретін жұмыс жоқ"
          description="Студенттер жұмыс жіберген кезде осында көрінеді."
        />
      : null}
      <div className="grid gap-4">
        {filtered.map((w) => (
          <div key={w.id} className="rounded-lg border border-neutral-200 bg-white p-4 flex flex-wrap justify-between gap-4">
            <div>
              <div className="font-semibold">{w.title}</div>
              <div className="text-sm text-neutral-600 mt-1">
                {w.student.name} · {w.student.facultyName}
              </div>
              <div className="text-xs text-neutral-400">{w.student.email}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  w.daysWaiting >= 7 ? "bg-red-100 text-red-800"
                  : w.daysWaiting >= 3 ? "bg-amber-100 text-amber-800"
                  : "bg-teal-100 text-teal-800"
                }`}
              >
                {w.daysWaiting} күн
              </span>
              <Link href={`/supervisor/review/${w.id}`} className="text-sm font-medium text-blue-600">
                Тексеруді бастау →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
