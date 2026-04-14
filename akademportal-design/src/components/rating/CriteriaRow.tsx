import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface CriteriaRowProps {
  key?: any;
  label: string;
  score: number;
  maxScore?: number;
  delay?: number;
  className?: string;
  compact?: boolean;
}

export function CriteriaRow({
  label,
  score,
  maxScore = 5,
  delay = 0,
  className,
  compact = false,
}: CriteriaRowProps) {
  const percentage = (score / maxScore) * 100;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {!compact && (
        <span className="text-[13px] text-neutral-700 font-medium w-24 shrink-0">
          {label}
        </span>
      )}
      <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className="h-full bg-primary rounded-full"
        />
      </div>
      <span className={cn("text-neutral-900 font-medium shrink-0", compact ? "text-[11px]" : "text-[13px] w-8 text-right")}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}
