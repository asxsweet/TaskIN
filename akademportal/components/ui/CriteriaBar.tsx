"use client";

import { motion } from "framer-motion";

export function CriteriaBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-600">{label}</span>
        <span className="font-semibold">{score.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / 5) * 100}%` }}
          className="h-full bg-primary"
        />
      </div>
    </div>
  );
}
