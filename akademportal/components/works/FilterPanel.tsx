"use client";

import { Button } from "@/components/ui/Button";

type Agg = { key: string | number; doc_count: number; name?: string };

export function FilterPanel({
  typeBuckets,
  facultyBuckets,
  selectedTypes,
  selectedFaculties,
  toggleType,
  toggleFaculty,
  apply,
}: {
  typeBuckets: Agg[];
  facultyBuckets: Agg[];
  selectedTypes: Set<string>;
  selectedFaculties: Set<string>;
  toggleType: (k: string) => void;
  toggleFaculty: (k: string) => void;
  apply: () => void;
}) {
  const typeLabels: Record<string, string> = {
    DIPLOMA: "Дипломдық жұмыс",
    COURSE: "Курстық жұмыс",
    ARTICLE: "Ғылыми мақала",
    ESSAY: "Эссе",
    PROJECT: "Жоба",
  };
  return (
    <aside className="w-[260px] border-r border-neutral-100 p-8 space-y-8 hidden lg:block">
      <div>
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4">Жұмыс түрі</h4>
        <div className="space-y-3">
          {typeBuckets.map((item) => (
            <label key={String(item.key)} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTypes.has(String(item.key))}
                  onChange={() => toggleType(String(item.key))}
                  className="rounded border-neutral-300 text-primary focus:ring-primary/25"
                />
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  {typeLabels[String(item.key)] ?? String(item.key)}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">{item.doc_count}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4">Факультет</h4>
        <div className="space-y-3">
          {facultyBuckets.map((item) => (
            <label key={String(item.key)} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFaculties.has(String(item.key))}
                  onChange={() => toggleFaculty(String(item.key))}
                  className="rounded border-neutral-300 text-primary focus:ring-primary/25"
                />
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  {(item as Agg & { name?: string }).name ?? String(item.key)}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">{item.doc_count}</span>
            </label>
          ))}
        </div>
      </div>

      <Button className="w-full mt-8" type="button" onClick={apply}>
        Қолдану
      </Button>
    </aside>
  );
}
