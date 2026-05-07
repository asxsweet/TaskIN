"use client";

import { cn } from "@/lib/utils";

export function Toast({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "success" | "error";
}) {
  const cls =
    variant === "success" ? "bg-success-tint text-success border-success/20 dark:bg-success/15 dark:text-emerald-300"
    : variant === "error" ? "bg-danger-tint text-danger border-danger/20 dark:bg-danger/15 dark:text-red-300"
    : "bg-primary-tint text-primary border-primary/20 dark:bg-primary/15 dark:text-blue-300";
  return (
    <div className={cn("rounded-md border px-3 py-2 text-sm", cls)}>
      {children}
    </div>
  );
}
