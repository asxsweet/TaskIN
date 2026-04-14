"use client";

import { useEffect, useState } from "react";
import { WorkTable, type WorkTableRow } from "@/components/works/WorkTable";
import { apiJsonSafe } from "@/lib/fetcher";

export default function AdminWorksPage() {
  const [rows, setRows] = useState<WorkTableRow[]>([]);
  useEffect(() => {
    apiJsonSafe<{ items?: unknown[] }>("/api/works?limit=100", { items: [] }).then((d) =>
      setRows(
        ((d.items ?? []) as {
          id: string;
          title: string;
          type: WorkTableRow["type"];
          status: WorkTableRow["status"];
          createdAt: string;
          author: { name: string };
          faculty: { name: string };
        }[]).map((w) => ({
          id: w.id,
          title: w.title,
          type: w.type,
          status: w.status,
          createdAt: w.createdAt,
          author: w.author.name,
          faculty: w.faculty.name,
        }))
      )
    );
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Барлық жұмыстар</h1>
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs">
        <WorkTable rows={rows} />
      </div>
    </div>
  );
}
