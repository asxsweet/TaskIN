import { motion } from "motion/react";
import { Eye, Download, Calendar, FileText } from "lucide-react";
import { Badge } from "./ui/Badge";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { cn } from "@/src/lib/utils";

export interface WorkCardProps {
  key?: any;
  title: string;
  author: string;
  faculty: string;
  supervisor: string;
  abstract: string;
  type: string;
  status?: "approved" | "pending" | "rejected";
  views: number;
  downloads: number;
  date: string;
  tags: string[];
  variant?: "horizontal" | "vertical" | "compact";
}

export function WorkCard({
  title,
  author,
  faculty,
  supervisor,
  abstract,
  type,
  status,
  views,
  downloads,
  date,
  tags,
  variant = "vertical",
}: WorkCardProps) {
  const isCompact = variant === "compact";
  const isHorizontal = variant === "horizontal";

  return (
    <motion.div
      whileHover={{ borderColor: "var(--color-primary)" }}
      className={cn(
        "bg-white border border-neutral-200 rounded-lg shadow-xs overflow-hidden transition-all duration-150",
        isHorizontal ? "md:flex gap-6 p-6" : "p-5 flex flex-col gap-4",
        isCompact && "p-4"
      )}
    >
      <div className={cn("flex flex-col gap-3", isHorizontal && "flex-1")}>
        <div className="flex items-center gap-2">
          <Badge variant="type">{type}</Badge>
          {status && (
            <Badge variant={status === "approved" ? "approved" : status === "pending" ? "pending" : "rejected"}>
              {status === "approved" ? "Бекітілді" : status === "pending" ? "Тексеруде" : "Қабылданбады"}
            </Badge>
          )}
        </div>

        <h3 className={cn("font-medium text-neutral-900 line-clamp-2 leading-tight", isCompact ? "text-sm" : "text-base")}>
          {title}
        </h3>

        {!isCompact && (
          <div className="flex items-center gap-2 text-[13px] text-neutral-600">
            <Avatar initials={author.split(" ").map(n => n[0]).join("")} size="sm" />
            <span>{author}</span>
            <span className="text-neutral-300">•</span>
            <span>{faculty}</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-400">Жетекші: {supervisor}</span>
          </div>
        )}

        {!isCompact && (
          <p className="text-[13px] text-neutral-500 line-clamp-3 leading-relaxed">
            {abstract}
          </p>
        )}

        {!isCompact && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="tag">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-4 text-[12px] text-neutral-400">
            <span className="flex items-center gap-1">
              <Eye size={14} /> {views}
            </span>
            <span className="flex items-center gap-1">
              <Download size={14} /> {downloads}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {date}
            </span>
          </div>
          
          {!isCompact && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <FileText size={14} className="mr-1.5" /> PDF
              </Button>
              <Button variant="ghost" size="sm">
                Қарау →
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
