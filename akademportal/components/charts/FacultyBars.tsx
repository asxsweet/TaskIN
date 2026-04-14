"use client";

import { motion } from "framer-motion";

export function FacultyBars({
  rows,
}: {
  rows: { id: string; name: string; worksCount: number }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.worksCount));
  return (
    <div className="space-y-4">
      {rows.map((item) => (
        <div key={item.id} className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-600">{item.name}</span>
            <span className="font-bold text-neutral-900">{item.worksCount}</span>
          </div>
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.worksCount / max) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
