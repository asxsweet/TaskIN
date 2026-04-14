"use client";

import Link from "next/link";
import { ScoreRing } from "@/components/ui/ScoreRing";

export function LeaderboardTable({
  rows,
}: {
  rows: { rank: number; id: string; title: string; author: string; faculty: string; score: number; downloads: number }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 border-b border-neutral-100">
            <th className="px-6 py-4">Орын</th>
            <th className="px-6 py-4">Тақырып</th>
            <th className="px-6 py-4">Автор</th>
            <th className="px-6 py-4">Факультет</th>
            <th className="px-6 py-4">Балл</th>
            <th className="px-6 py-4">Жүктеу</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-neutral-50 hover:bg-neutral-50">
              <td className="px-6 py-4">
                <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-warning text-white">
                  {row.rank}
                </div>
              </td>
              <td className="px-6 py-4 font-medium max-w-xs truncate">
                <Link href={`/works/${row.id}`} className="hover:text-primary">
                  {row.title}
                </Link>
              </td>
              <td className="px-6 py-4 text-neutral-600">{row.author}</td>
              <td className="px-6 py-4 text-neutral-500">{row.faculty}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <ScoreRing score={row.score} size={32} strokeWidth={3} />
                  <span className="font-bold">{row.score}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-neutral-400">{row.downloads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
