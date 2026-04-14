import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  variant?: "display" | "interactive";
  onRatingChange?: (rating: number) => void;
  count?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  variant = "display",
  onRatingChange,
  count,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizes = {
    sm: 12,
    md: 16,
    lg: 24,
  };

  const iconSize = sizes[size];

  const handleMouseEnter = (index: number) => {
    if (variant === "interactive") {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (variant === "interactive") {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (variant === "interactive" && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center" onMouseLeave={handleMouseLeave}>
        {Array.from({ length: maxRating }).map((_, i) => {
          const index = i + 1;
          const isFilled = hoverRating ? index <= hoverRating : index <= rating;
          const isHovered = variant === "interactive" && hoverRating >= index;

          return (
            <motion.button
              key={i}
              type="button"
              disabled={variant === "display"}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              whileHover={variant === "interactive" ? { scale: 1.1 } : {}}
              whileTap={variant === "interactive" ? { scale: 0.9 } : {}}
              className={cn(
                "p-0.5 transition-colors focus:outline-none",
                variant === "display" ? "cursor-default" : "cursor-pointer"
              )}
            >
              <Star
                size={iconSize}
                fill={isFilled ? (isHovered ? "#FCD34D" : "#F59E0B") : "transparent"}
                stroke={isFilled ? (isHovered ? "#FCD34D" : "#F59E0B") : "#E4E4E7"}
                className={cn(
                  "transition-colors",
                  isFilled ? "text-star-filled" : "text-neutral-200"
                )}
              />
            </motion.button>
          );
        })}
      </div>
      {variant === "display" && (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-neutral-900">{rating.toFixed(1)}</span>
          {count !== undefined && (
            <span className="text-xs text-neutral-500">({count} баға)</span>
          )}
        </div>
      )}
    </div>
  );
}
