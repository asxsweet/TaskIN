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
    variant === "success" ? "bg-success-tint text-success border-success/20"
    : variant === "error" ? "bg-danger-tint text-danger border-danger/20"
    : "bg-primary-tint text-primary border-primary/20";
  return (
    <div className={cn("rounded-md border px-3 py-2 text-sm", cls)}>
      {children}
    </div>
  );
}
