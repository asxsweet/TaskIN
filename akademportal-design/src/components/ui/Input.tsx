import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-[40px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:bg-neutral-100 transition-all",
            error && "border-danger focus-visible:ring-danger/25",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[11px] text-danger">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
