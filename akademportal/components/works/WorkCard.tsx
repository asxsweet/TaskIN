"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Download, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { workTypeLabel, workStatusLabel } from "@/lib/work-labels";
import type { WorkStatus, WorkType } from "@prisma/client";
import { PlagiarismBadge } from "@/components/ui/PlagiarismBadge";

export type WorkCardData = {
  id: string;
  title: string;
  authorName: string;
  facultyName: string;
  supervisorName: string | null;
  abstract: string;
  type: WorkType;
  status?: WorkStatus;
  views: number;
  downloads: number;
  year: number;
  tags: string[];
  plagiarismScore?: number | null;
  variant?: "horizontal" | "vertical" | "compact";
};

export function WorkCard({
  id,
  title,
  authorName,
  facultyName,
  supervisorName,
  abstract,
  type,
  status,
  views,
  downloads,
  year,
  tags,
  plagiarismScore,
  variant = "vertical",
}: WorkCardData) {
  const isCompact = variant === "compact";
  const isHorizontal = variant === "horizontal";

  const statusVariant =
    status === "APPROVED" ? "approved"
    : status === "PENDING" ? "pending"
    : status === "REJECTED" ? "rejected"
    : "pending";

  return (
    <motion.div
      whileHover={{ borderColor: "#1E52CC" }}
      className={cn(
        "bg-white border border-neutral-200 rounded-lg shadow-xs overflow-hidden transition-all duration-150",
        isHorizontal ? "md:flex gap-6 p-6" : "p-5 flex flex-col gap-4",
        isCompact && "p-4"
      )}
    >
      <div className={cn("flex flex-col gap-3", isHorizontal && "flex-1")}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="type">{workTypeLabel(type)}</Badge>
          {status && <Badge variant={statusVariant}>{workStatusLabel(status)}</Badge>}
          <PlagiarismBadge score={plagiarismScore ?? null} />
        </div>

        <h3
          className={cn(
            "font-medium text-neutral-900 line-clamp-2 leading-tight",
            isCompact ? "text-sm" : "text-base"
          )}
        >
          {title}
        </h3>

        {!isCompact && (
          <div className="flex items-center gap-2 text-[13px] text-neutral-600 flex-wrap">
            <Avatar
              initials={authorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
              size="sm"
            />
            <span>{authorName}</span>
            <span className="text-neutral-300">•</span>
            <span>{facultyName}</span>
            {supervisorName && (
              <>
                <span className="text-neutral-300">•</span>
                <span className="text-neutral-400">Жетекші: {supervisorName}</span>
              </>
            )}
          </div>
        )}

        {!isCompact && (
          <p className="text-[13px] text-neutral-500 line-clamp-3 leading-relaxed">{abstract}</p>
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

        <div className="flex items-center justify-between mt-auto pt-2 gap-2 flex-wrap">
          <div className="flex items-center gap-4 text-[12px] text-neutral-400">
            <span className="flex items-center gap-1">
              <Eye size={14} /> {views}
            </span>
            <span className="flex items-center gap-1">
              <Download size={14} /> {downloads}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {year}
            </span>
          </div>

          {!isCompact && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" type="button">
                <FileText size={14} className="mr-1.5" /> PDF
              </Button>
              <Link href={`/works/${id}`}>
                <Button variant="ghost" size="sm" type="button">
                  Қарау →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
