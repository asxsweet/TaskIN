import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "type" | "approved" | "pending" | "rejected" | "tag";
  children?: React.ReactNode;
  className?: string;
  key?: any;
}

export function Badge({ className, variant = "tag", ...props }: BadgeProps) {
  const variants = {
    type: "bg-primary-tint text-primary",
    approved: "bg-success-tint text-success",
    pending: "bg-warning-tint text-warning",
    rejected: "bg-danger-tint text-danger",
    tag: "bg-neutral-100 text-neutral-600",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xs px-2 py-0.5 text-[11px] font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
