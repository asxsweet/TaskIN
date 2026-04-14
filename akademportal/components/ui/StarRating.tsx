"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ value, onChange, readOnly }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(s)}
          className={cn("p-0.5", readOnly && "cursor-default")}
        >
          <Star
            size={18}
            className={cn(s <= value ? "fill-warning text-warning" : "text-neutral-200")}
          />
        </button>
      ))}
    </div>
  );
}
