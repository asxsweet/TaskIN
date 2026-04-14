"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WorkCard } from "@/components/works/WorkCard";
import { SearchBar } from "@/components/works/SearchBar";
import { FilterPanel } from "@/components/works/FilterPanel";
import { useDebouncedValue } from "@/hooks/useSearch";
import { formatNumber } from "@/lib/utils";
import { apiJsonSafe } from "@/lib/fetcher";
import { EmptyState } from "@/components/ui/EmptyState";
import type { WorkType } from "@prisma/client";

type Hit = {
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
};

type SearchResponse = { total: number; hits: Hit[]; aggregations: unknown };

export default function SearchPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const debouncedQ = useDebouncedValue(q, 300);
  const [sort, setSort] = useState(params.get("sort") || "relevance");
  const [page, setPage] = useState(Number(params.get("page") || 1));
  const [data, setData] = useState<SearchResponse | null>(null);
  const [facultyMap, setFacultyMap] = useState<Record<string, string>>({});
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set((params.get("type") || "").split(",").filter(Boolean))
  );
  const [selectedFaculties, setSelectedFaculties] = useState<Set<string>>(
    new Set((params.get("faculty") || "").split(",").filter(Boolean))
  );

  useEffect(() => {
    fetch("/api/public/faculties", { cache: "no-store" })
      .then(async (r) => {
        const d = (await r.json()) as { faculties?: { id: string; name: string }[] };
        if (!r.ok) return;
        const m: Record<string, string> = {};
        for (const f of d.faculties ?? []) m[f.id] = f.name;
        setFacultyMap(m);
      })
      .catch(() => undefined);
  }, []);

  const persistUrl = useCallback(() => {
    const p = new URLSearchParams();
    if (debouncedQ) p.set("q", debouncedQ);
    if (sort) p.set("sort", sort);
    p.set("page", String(page));
    if (selectedTypes.size) p.set("type", Array.from(selectedTypes).join(","));
    if (selectedFaculties.size) p.set("faculty", Array.from(selectedFaculties).join(","));
    router.replace(`/search?${p.toString()}`, { scroll: false });
  }, [debouncedQ, sort, page, selectedTypes, selectedFaculties, router]);

  useEffect(() => {
    persistUrl();
  }, [persistUrl]);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (debouncedQ) qs.set("q", debouncedQ);
    qs.set("sort", sort);
    qs.set("page", String(page));
    if (selectedTypes.size) qs.set("type", Array.from(selectedTypes).join(","));
    if (selectedFaculties.size) qs.set("faculty", Array.from(selectedFaculties).join(","));
    const emptySearch: SearchResponse = {
      total: 0,
      hits: [],
      aggregations: { types: [], faculties: [], years: [], languages: [] },
    };
    apiJsonSafe<SearchResponse>(`/api/search?${qs.toString()}`, emptySearch).then(setData);
  }, [debouncedQ, sort, page, selectedTypes, selectedFaculties]);

  const aggs = data?.aggregations as {
    types: { key: string; doc_count: number }[];
    faculties: { key: string; doc_count: number; name?: string }[];
  } | null;

  const facultyBuckets = useMemo(() => {
    const rows = aggs?.faculties ?? [];
    return rows.map((r) => ({ ...r, name: facultyMap[String(r.key)] ?? String(r.key) }));
  }, [aggs?.faculties, facultyMap]);

  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    selectedFaculties.forEach((id) => {
      chips.push({
        label: facultyMap[id] ?? id,
        onRemove: () =>
          setSelectedFaculties((s) => {
            const n = new Set(s);
            n.delete(id);
            return n;
          }),
      });
    });
    selectedTypes.forEach((t) => {
      chips.push({
        label: t,
        onRemove: () =>
          setSelectedTypes((s) => {
            const n = new Set(s);
            n.delete(t);
            return n;
          }),
      });
    });
    return chips;
  }, [facultyMap, selectedFaculties, selectedTypes]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white -m-4 md:-m-8">
      <div className="px-4 md:px-8 py-6 border-b border-neutral-100 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
            {data ? `${formatNumber(data.total)} жұмыс табылды` : "Іздеу…"}
          </h1>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            Сұрыптау:
            <select
              className="font-medium text-neutral-900 bg-transparent border border-neutral-200 rounded px-2 py-1"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="relevance">Релеванттылық</option>
              <option value="date">Күні</option>
              <option value="downloads">Жүктеулер</option>
              <option value="rating">Рейтинг</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar value={q} onChange={setQ} onSearch={() => undefined} />
          <Button size="lg" className="px-8" type="button">
            Іздеу
          </Button>
        </div>
      </div>

      <div className="sticky top-14 z-30 bg-white border-b border-neutral-100 px-4 md:px-8 py-3 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Button variant="secondary" size="sm" className="gap-2 shrink-0" type="button">
            <Filter size={14} /> Сүзгілер{" "}
            <Badge variant="tag" className="bg-primary text-white ml-1">
              {selectedTypes.size + selectedFaculties.size}
            </Badge>
          </Button>
          <div className="h-6 w-px bg-neutral-200 mx-2 shrink-0" />
          <div className="flex gap-2">
            {activeChips.map((c) => (
              <Badge key={c.label} variant="type" className="gap-1 pr-1">
                {c.label}{" "}
                <button type="button" onClick={c.onRemove}>
                  <X size={12} />
                </button>
              </Badge>
            ))}
            {activeChips.length > 0 && (
              <button
                type="button"
                className="text-[11px] font-medium text-danger hover:underline ml-2 shrink-0"
                onClick={() => {
                  setSelectedFaculties(new Set());
                  setSelectedTypes(new Set());
                }}
              >
                Сүзгіні тазалау
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 bg-neutral-50">
        <FilterPanel
          typeBuckets={aggs?.types ?? []}
          facultyBuckets={facultyBuckets}
          selectedTypes={selectedTypes}
          selectedFaculties={selectedFaculties}
          toggleType={(k) =>
            setSelectedTypes((s) => {
              const n = new Set(s);
              n.has(k) ? n.delete(k) : n.add(k);
              return n;
            })
          }
          toggleFaculty={(k) =>
            setSelectedFaculties((s) => {
              const n = new Set(s);
              n.has(k) ? n.delete(k) : n.add(k);
              return n;
            })
          }
          apply={() => setPage(1)}
        />
        <main className="flex-1 p-4 md:p-8">
          {data !== null && data.total === 0 ?
            <EmptyState title="Жұмыстар базада жоқ" description="Бос дерекқор немесе сүзгі нәтижесі жоқ." />
          : null}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {(data?.hits ?? []).map((w) => (
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
          <div className="mt-12 flex justify-center gap-2">
            <Button
              variant="secondary"
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ←
            </Button>
            <span className="px-3 py-2 text-sm">{page}</span>
            <Button variant="secondary" type="button" onClick={() => setPage((p) => p + 1)}>
              →
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
