import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm",
        "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        className
      )}
      {...props}
    />
  )
);
Select.displayName = "Select";
