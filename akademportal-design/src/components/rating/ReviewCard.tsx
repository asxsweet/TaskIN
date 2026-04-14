import * as React from "react";
import { ThumbsUp, ThumbsDown, Flag, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { StarRating } from "./StarRating";
import { CriteriaRow } from "./CriteriaRow";
import { cn } from "@/src/lib/utils";

interface ReviewCardProps {
  key?: any;
  reviewer: {
    name: string;
    role: string;
    avatar?: string;
  };
  date: string;
  rating: number;
  comment: string;
  criteria: {
    label: string;
    score: number;
  }[];
  helpfulCount: number;
  unhelpfulCount: number;
  className?: string;
}

export function ReviewCard({
  reviewer,
  date,
  rating,
  comment,
  criteria,
  helpfulCount,
  unhelpfulCount,
  className,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [helpful, setHelpful] = React.useState(helpfulCount);
  const [unhelpful, setUnhelpful] = React.useState(unhelpfulCount);

  return (
    <div className={cn(
      "bg-white border border-neutral-200 rounded-lg p-5 shadow-xs flex flex-col gap-4",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar initials={reviewer.name.split(" ").map(n => n[0]).join("")} size="sm" className="h-9 w-9" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-900">{reviewer.name}</span>
              <Badge variant="tag" className="text-[10px] py-0 px-1.5">{reviewer.role}</Badge>
            </div>
            <span className="text-[11px] text-neutral-400">{date}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={rating} size="sm" />
          <Badge variant={rating >= 4.5 ? "approved" : rating >= 3 ? "pending" : "rejected"} className="text-[10px]">
            {rating.toFixed(1)} балл
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {criteria.map((c, i) => (
          <CriteriaRow 
            key={i} 
            label={c.label} 
            score={c.score} 
            compact 
            className="h-4" 
            delay={i * 0.1}
          />
        ))}
      </div>

      <div className="relative">
        <p className={cn(
          "text-[13px] text-neutral-700 leading-relaxed",
          !isExpanded && "line-clamp-3"
        )}>
          {comment}
        </p>
        {comment.length > 150 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[12px] text-primary font-medium mt-1 flex items-center gap-1 hover:underline"
          >
            {isExpanded ? (
              <>Аз көрсету <ChevronUp size={14} /></>
            ) : (
              <>Толығырақ <ChevronDown size={14} /></>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-neutral-500">Пайдалы ма?</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setHelpful(helpful + 1)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-neutral-50 text-[12px] text-neutral-600 transition-colors"
            >
              <ThumbsUp size={14} /> {helpful}
            </button>
            <button 
              onClick={() => setUnhelpful(unhelpful + 1)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-neutral-50 text-[12px] text-neutral-600 transition-colors"
            >
              <ThumbsDown size={14} /> {unhelpful}
            </button>
          </div>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <Flag size={14} />
        </button>
      </div>
    </div>
  );
}
