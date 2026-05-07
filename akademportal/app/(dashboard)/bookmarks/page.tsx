"use client";

import { useEffect, useState } from "react";
import { WorkCard } from "@/components/works/WorkCard";
import type { WorkType } from "@prisma/client";
import { apiJsonSafe } from "@/lib/fetcher";

export default function BookmarksPage() {
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string>("all");
  const [newFolder, setNewFolder] = useState("");
  const [items, setItems] = useState<
    {
      bookmarkId: string;
      folderId: string | null;
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
      folders?: { id: string; name: string }[];
      items?: {
        bookmarkId: string;
        folderId: string | null;
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
    }>("/api/bookmarks", { folders: [], items: [] }).then((d) => {
      setFolders(d.folders ?? []);
      setItems(d.items ?? []);
    });
  }, []);

  const visibleItems =
    activeFolderId === "all" ? items : items.filter((i) => i.folderId === activeFolderId);

  async function createFolder() {
    const name = newFolder.trim();
    if (!name) return;
    const r = await fetch("/api/bookmarks/folders", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!r.ok) return;
    const j = (await r.json()) as { folder?: { id: string; name: string } };
    if (j.folder) {
      setFolders((prev) => [j.folder!, ...prev]);
      setNewFolder("");
    }
  }

  return (
    <div className="space-y-6 -m-4 md:-m-6 lg:-m-8 px-4 md:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold">Бетбелгілер</h1>
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => setActiveFolderId("all")}
          className={`rounded-full border px-3 py-1 text-xs ${
            activeFolderId === "all" ? "border-primary bg-primary-tint text-primary" : "border-neutral-200 dark:border-neutral-700"
          }`}
        >
          Барлығы
        </button>
        {folders.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFolderId(f.id)}
            className={`rounded-full border px-3 py-1 text-xs ${
              activeFolderId === f.id ? "border-primary bg-primary-tint text-primary" : "border-neutral-200 dark:border-neutral-700"
            }`}
          >
            {f.name}
          </button>
        ))}
        <input
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
          placeholder="Жаңа папка"
          className="h-8 rounded-md border border-neutral-200 px-2 text-xs dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button type="button" onClick={createFolder} className="text-xs text-primary">
          Қосу
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleItems.map((w) => (
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
