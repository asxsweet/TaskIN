"use client";

import { useEffect, useState } from "react";
import { WorkCard } from "@/components/works/WorkCard";
import type { WorkType } from "@prisma/client";
import { apiJsonSafe } from "@/lib/fetcher";

export default function BookmarksPage() {
  const [items, setItems] = useState<
    {
      id: string;
      title: string;
      abstract: string;
      type: WorkType;
      year: number;
      viewCount: number;
      downloads: number;
      authorName: string;
      facultyName: string;
      supervisorName: string | null;
      keywords: string[];
    }[]
  >([]);
  useEffect(() => {
    apiJsonSafe<{
      items?: {
        id: string;
        title: string;
        abstract: string;
        type: WorkType;
        year: number;
        viewCount: number;
        downloads: number;
        authorName: string;
        facultyName: string;
        supervisorName: string | null;
        keywords: string[];
      }[];
    }>("/api/bookmarks", { items: [] }).then((d) => setItems(d.items ?? []));
  }, []);

  return (
    <div className="space-y-6 -m-4 md:-m-8 px-4 md:px-8 py-6">
      <h1 className="text-2xl font-semibold">Бетбелгілер</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((w) => (
          <WorkCard
            key={w.id}
            id={w.id}
            title={w.title}
            authorName={w.authorName}
            facultyName={w.facultyName}
            supervisorName={w.supervisorName}
            abstract={w.abstract}
            type={w.type}
            views={w.viewCount}
            downloads={w.downloads}
            year={w.year}
            tags={w.keywords}
          />
        ))}
      </div>
    </div>
  );
}
