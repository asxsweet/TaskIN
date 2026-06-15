"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WorkCard } from "@/components/works/WorkCard";
import { SearchBar } from "@/components/works/SearchBar";
import { FilterPanel } from "@/components/works/FilterPanel";
import { useDebouncedValue } from "@/hooks/useSearch";
import { formatNumber } from "@/lib/utils";
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

const emptySearch: SearchResponse = {
  total: 0,
  hits: [],
  aggregations: { types: [], faculties: [], years: [], languages: [] },
};

const SEARCH_DEBOUNCE_MS = 450;
const YEAR_DEBOUNCE_MS = 500;
const URL_SYNC_DEBOUNCE_MS = 550;

type SearchClientProps = {
  basePath?: string;
  workHrefPrefix?: string;
};

export default function SearchClient({
  basePath = "/search",
  workHrefPrefix = "/works",
}: SearchClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const debouncedQ = useDebouncedValue(q, SEARCH_DEBOUNCE_MS);
  const [overrideQ, setOverrideQ] = useState<string | null>(null);
  const effectiveQ = overrideQ !== null ? overrideQ : debouncedQ;
  const [sort, setSort] = useState(params.get("sort") || "relevance");
  const [lang, setLang] = useState(params.get("lang") || "");
  const [yearFrom, setYearFrom] = useState(params.get("yearFrom") || "");
  const [yearTo, setYearTo] = useState(params.get("yearTo") || "");
  const debouncedYearFrom = useDebouncedValue(yearFrom, YEAR_DEBOUNCE_MS);
  const debouncedYearTo = useDebouncedValue(yearTo, YEAR_DEBOUNCE_MS);
  const [page, setPage] = useState(Number(params.get("page") || 1));
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchSeq = useRef(0);
  const [facultyMap, setFacultyMap] = useState<Record<string, string>>({});
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set((params.get("type") || "").split(",").filter(Boolean))
  );
  const [selectedFaculties, setSelectedFaculties] = useState<Set<string>>(
    new Set((params.get("faculty") || "").split(",").filter(Boolean))
  );
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (overrideQ === null) return;
    if (debouncedQ.trim() === overrideQ) setOverrideQ(null);
  }, [debouncedQ, overrideQ]);

  useEffect(() => {
    const raw = localStorage.getItem("taskin-search-history");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as string[];
      setRecentQueries(Array.isArray(parsed) ? parsed.slice(0, 8) : []);
    } catch {
      setRecentQueries([]);
    }
  }, []);

  useEffect(() => {
    const val = debouncedQ.trim();
    if (!val) return;
    setRecentQueries((prev) => {
      const next = [val, ...prev.filter((x) => x !== val)].slice(0, 8);
      localStorage.setItem("taskin-search-history", JSON.stringify(next));
      return next;
    });
  }, [debouncedQ]);

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

  const typeKey = useMemo(() => Array.from(selectedTypes).sort().join(","), [selectedTypes]);
  const facultyKey = useMemo(() => Array.from(selectedFaculties).sort().join(","), [selectedFaculties]);

  /** Терминалдағы әрбір өзгерісте router.replace шақырмау — App Router баяулайды; URL баяу синхрондалады. */
  useEffect(() => {
    const t = window.setTimeout(() => {
      const p = new URLSearchParams();
      if (effectiveQ) p.set("q", effectiveQ);
      if (sort) p.set("sort", sort);
      if (lang) p.set("lang", lang);
      if (debouncedYearFrom) p.set("yearFrom", debouncedYearFrom);
      if (debouncedYearTo) p.set("yearTo", debouncedYearTo);
      p.set("page", String(page));
      if (typeKey) p.set("type", typeKey);
      if (facultyKey) p.set("faculty", facultyKey);
      const qs = p.toString();
      const next = qs ? `${basePath}?${qs}` : basePath;
      if (typeof window !== "undefined" && `${window.location.pathname}${window.location.search}` !== next) {
        router.replace(next, { scroll: false });
      }
    }, URL_SYNC_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [
    basePath,
    effectiveQ,
    sort,
    lang,
    debouncedYearFrom,
    debouncedYearTo,
    page,
    typeKey,
    facultyKey,
    router,
  ]);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (effectiveQ) qs.set("q", effectiveQ);
    qs.set("sort", sort);
    if (lang) qs.set("lang", lang);
    if (debouncedYearFrom) qs.set("yearFrom", debouncedYearFrom);
    if (debouncedYearTo) qs.set("yearTo", debouncedYearTo);
    qs.set("page", String(page));
    if (typeKey) qs.set("type", typeKey);
    if (facultyKey) qs.set("faculty", facultyKey);
    const url = `/api/search?${qs.toString()}`;
    const id = ++fetchSeq.current;
    const ac = new AbortController();
    let cancelled = false;
    setLoading(true);
    fetch(url, { credentials: "include", signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) return emptySearch;
        return (await r.json()) as SearchResponse;
      })
      .then((payload) => {
        if (cancelled || fetchSeq.current !== id) return;
        setData(payload);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        if (e instanceof Error && e.name === "AbortError") return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (fetchSeq.current !== id) return;
        setData(emptySearch);
      })
      .finally(() => {
        if (cancelled || fetchSeq.current !== id) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [effectiveQ, sort, lang, debouncedYearFrom, debouncedYearTo, page, typeKey, facultyKey]);

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

  const commitSearch = useCallback(() => {
    setOverrideQ(q.trim());
    setPage(1);
    requestAnimationFrame(() =>
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }, [q]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white -m-4 md:-m-6 lg:-m-8 dark:bg-neutral-950">
      <div className="px-4 md:px-6 lg:px-8 py-6 border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {loading ? "Нәтиже жүктелуде…" : data ? `${formatNumber(data.total)} жұмыс табылды` : "Іздеу…"}
          </h1>
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            Сұрыптау:
            <select
              className="font-medium text-neutral-900 bg-transparent border border-neutral-200 rounded px-2 py-1 dark:border-neutral-700 dark:text-neutral-100"
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
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <SearchBar value={q} onChange={setQ} onSearch={commitSearch} />
          <Button size="lg" className="px-8 sm:shrink-0 w-full sm:w-auto" type="button" onClick={commitSearch}>
            Іздеу
          </Button>
        </div>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Сұрау {SEARCH_DEBOUNCE_MS} мс кейін автоматты жаңартылады; дереу нәтиже үшін Enter немесе «Іздеу» батырмасын басыңыз. Сүзгілердің жауабы бірігу үшін қысқа кідіріс бар.
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <select
            className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Барлық тіл</option>
            <option value="KAZAKH">Қазақша</option>
            <option value="RUSSIAN">Орысша</option>
            <option value="ENGLISH">Ағылшынша</option>
          </select>
          <input
            className="h-10 w-28 rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            type="number"
            placeholder="Жыл (басы)"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
          />
          <input
            className="h-10 w-28 rounded-md border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            type="number"
            placeholder="Жыл (соңы)"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
          />
        </div>
        {recentQueries.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">Соңғы іздеулер:</span>
            {recentQueries.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQ(item);
                  setOverrideQ(item.trim());
                  setPage(1);
                }}
                className="rounded-full border border-neutral-200 px-2 py-1 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sticky top-14 z-30 bg-white border-b border-neutral-100 px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between overflow-x-auto dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 shrink-0 md:hidden"
            type="button"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter size={14} /> Сүзгілер{" "}
            <Badge variant="tag" className="bg-primary text-white ml-1">
              {selectedTypes.size + selectedFaculties.size}
            </Badge>
          </Button>
          <div className="h-6 w-px bg-neutral-200 mx-2 shrink-0 dark:bg-neutral-700" />
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

      <div className="flex flex-1 min-h-0 min-w-0 bg-neutral-50 dark:bg-neutral-950">
        <FilterPanel
          typeBuckets={aggs?.types ?? []}
          facultyBuckets={facultyBuckets}
          selectedTypes={selectedTypes}
          selectedFaculties={selectedFaculties}
          mobileOpen={filtersOpen}
          onMobileClose={() => setFiltersOpen(false)}
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
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          {data !== null && data.total === 0 ?
            <EmptyState title="Жұмыстар базада жоқ" description="Бос дерекқор немесе сүзгі нәтижесі жоқ." />
          : null}
          <div id="search-results" className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-28">
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
                viewHref={`${workHrefPrefix}/${w.id}`}
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
