"use client";

import { motion } from "framer-motion";

export function ActivitySparkline({ points }: { points: { date: string; count: number }[] }) {
  const max = Math.max(1, ...points.map((p) => p.count));
  return (
    <div className="h-48 flex items-end gap-2 mb-6">
      {points.map((p, i) => (
        <div key={p.date} className="flex-1 bg-primary-tint rounded-t-sm relative group h-full">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(p.count / max) * 100}%` }}
            className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm"
          />
        </div>
      ))}
    </div>
  );
}
