import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  type: "bg-primary-tint text-primary border border-primary/10",
  tag: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  approved: "bg-success-tint text-success",
  pending: "bg-warning-tint text-warning",
  rejected: "bg-danger-tint text-danger",
};

export function Badge({
  variant = "tag",
  className,
  children,
}: {
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
