import * as React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/src/lib/utils";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 shadow-sm",
      secondary: "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 shadow-xs",
      ghost: "bg-transparent text-primary hover:bg-primary-tint",
      danger: "bg-danger text-white hover:bg-danger/90 shadow-sm",
      outline: "bg-transparent text-primary border border-primary hover:bg-primary-tint",
    };

    const sizes = {
      sm: "h-[36px] px-3 text-sm",
      md: "h-[40px] px-4 text-sm",
      lg: "h-[48px] px-6 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-50",
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
