"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 shadow-sm",
      secondary: "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 shadow-xs",
      ghost: "bg-transparent text-primary hover:bg-primary-tint",
      danger: "bg-danger text-white hover:bg-danger/90 shadow-sm",
      outline: "bg-transparent text-primary border border-primary hover:bg-primary-tint",
    };
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
