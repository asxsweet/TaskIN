import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreRing({
  score,
  maxScore = 5,
  size = 80,
  strokeWidth = 6,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / maxScore) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 4.5) return "#0A7A5E"; // High
    if (val >= 3) return "#B45309"; // Mid
    return "#B91C1C"; // Low
  };

  const color = getColor(score);

  return (
    <div 
      className={cn("relative flex flex-col items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E4E4E7"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
        <span className="text-xl font-semibold text-neutral-900 leading-none">
          {score.toFixed(1)}
        </span>
        <span className="text-[10px] text-neutral-400 font-medium">
          / {maxScore.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
