import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, initials, size = "md", className, ...props }: AvatarProps) {
  const sizes = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-9 w-9 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-primary-tint text-primary font-medium items-center justify-center",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={initials}
          className="aspect-square h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
