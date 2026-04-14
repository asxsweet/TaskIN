"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WorkTable, type WorkTableRow } from "@/components/works/WorkTable";
import { apiJsonSafe } from "@/lib/fetcher";

export default function MyWorksPage() {
  const [rows, setRows] = useState<WorkTableRow[]>([]);
  useEffect(() => {
    apiJsonSafe<{ items?: unknown[] }>("/api/works?authorId=me&limit=100", { items: [] }).then((d) =>
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
    <div className="space-y-6 -m-4 md:-m-8 px-4 md:px-8 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Менің жұмыстарым</h1>
        <Link href="/upload" className="text-primary text-sm font-medium hover:underline">
          Жүктеу
        </Link>
      </div>
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs">
        <WorkTable rows={rows} />
      </div>
    </div>
  );
}
