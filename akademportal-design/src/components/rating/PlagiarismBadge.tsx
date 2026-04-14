import * as React from "react";
import { cn } from "@/src/lib/utils";
import { Check, AlertTriangle, X } from "lucide-react";

interface PlagiarismBadgeProps {
  percentage: number;
  className?: string;
}

export function PlagiarismBadge({ percentage, className }: PlagiarismBadgeProps) {
  const getStatus = (val: number) => {
    if (val >= 85) return {
      bg: "bg-success-tint",
      text: "text-success",
      icon: <Check size={12} />,
      label: "Түпнұсқа"
    };
    if (val >= 70) return {
      bg: "bg-warning-tint",
      text: "text-warning",
      icon: <AlertTriangle size={12} />,
      label: ""
    };
    return {
      bg: "bg-danger-tint",
      text: "text-danger",
      icon: <X size={12} />,
      label: ""
    };
  };

  const status = getStatus(percentage);

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold",
      status.bg,
      status.text,
      className
    )}>
      {status.icon}
      <span>{status.label} {percentage}%</span>
    </div>
  );
}
