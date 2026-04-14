"use client";

import { useEffect, useState } from "react";
import { LeaderboardTable } from "@/components/charts/LeaderboardTable";
import { apiJsonSafe } from "@/lib/fetcher";

type LeaderboardRow = {
  rank: number;
  id: string;
  title: string;
  author: string;
  faculty: string;
  score: number;
  downloads: number;
};
type ReviewerRow = { id: string; name: string; assigned: number; completed: number; avgScore: number };

export default function AdminRatingsPage() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [rev, setRev] = useState<ReviewerRow[]>([]);

  useEffect(() => {
    Promise.all([
      apiJsonSafe<{ leaderboard?: LeaderboardRow[] }>("/api/stats/leaderboard", { leaderboard: [] }),
      apiJsonSafe<{ reviewers?: ReviewerRow[] }>("/api/stats/reviewers", { reviewers: [] }),
    ]).then(([l, r]) => {
      setRows(l.leaderboard ?? []);
      setRev(r.reviewers ?? []);
    });
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Бағалаулар</h1>
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <LeaderboardTable rows={rows} />
      </div>
      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 mb-6">Жетекшілер белсенділігі</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[10px] font-bold text-neutral-400 uppercase border-b">
              <th className="pb-4">Жетекші</th>
              <th className="pb-4">Тағайындалды</th>
              <th className="pb-4">Аяқталды</th>
              <th className="pb-4">Орташа балл</th>
            </tr>
          </thead>
          <tbody>
            {rev.map((x) => (
              <tr key={x.id} className="border-b border-neutral-50">
                <td className="py-3 font-medium">{x.name}</td>
                <td className="py-3">{x.assigned}</td>
                <td className="py-3 text-success font-bold">{x.completed}</td>
                <td className="py-3 font-bold">{x.avgScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
