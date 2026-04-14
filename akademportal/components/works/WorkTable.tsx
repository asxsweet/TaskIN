"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { workTypeLabel, workStatusLabel } from "@/lib/work-labels";
import type { WorkStatus, WorkType } from "@prisma/client";

export type WorkTableRow = {
  id: string;
  title: string;
  type: WorkType;
  status: WorkStatus;
  author: string;
  faculty: string;
  createdAt: string;
};

export function WorkTable({ rows }: { rows: WorkTableRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 border-b border-neutral-100">
            <th className="px-6 py-4">Тақырып</th>
            <th className="px-6 py-4">Автор</th>
            <th className="px-6 py-4">Факультет</th>
            <th className="px-6 py-4">Түрі</th>
            <th className="px-6 py-4">Статус</th>
            <th className="px-6 py-4">Күні</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-neutral-50 hover:bg-neutral-50">
              <td className="px-6 py-4">
                <Link href={`/works/${row.id}`} className="font-medium text-primary hover:underline">
                  {row.title}
                </Link>
              </td>
              <td className="px-6 py-4">{row.author}</td>
              <td className="px-6 py-4 text-neutral-500">{row.faculty}</td>
              <td className="px-6 py-4">{workTypeLabel(row.type)}</td>
              <td className="px-6 py-4">
                <Badge
                  variant={
                    row.status === "APPROVED" ? "approved"
                    : row.status === "PENDING" ? "pending"
                    : "rejected"
                  }
                >
                  {workStatusLabel(row.status)}
                </Badge>
              </td>
              <td className="px-6 py-4 text-neutral-400">
                {new Date(row.createdAt).toLocaleDateString("kk-KZ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
