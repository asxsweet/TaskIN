"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ScoreRing({
  score,
  size = 40,
  strokeWidth = 3,
  className,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, score / 5));
  return (
    <svg width={size} height={size} className={cn("-rotate-90", className)}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#E4E4E7" strokeWidth={strokeWidth} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#1E52CC"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - pct) }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        strokeDasharray={c}
      />
    </svg>
  );
}
