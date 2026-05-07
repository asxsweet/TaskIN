"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Agg = { key: string | number; doc_count: number; name?: string };

const typeLabels: Record<string, string> = {
  DIPLOMA: "Дипломдық жұмыс",
  COURSE: "Курстық жұмыс",
  ARTICLE: "Ғылыми мақала",
  ESSAY: "Эссе",
  PROJECT: "Жоба",
};

function FilterPanelBody({
  typeBuckets,
  facultyBuckets,
  selectedTypes,
  selectedFaculties,
  toggleType,
  toggleFaculty,
  apply,
  onAfterApply,
}: {
  typeBuckets: Agg[];
  facultyBuckets: Agg[];
  selectedTypes: Set<string>;
  selectedFaculties: Set<string>;
  toggleType: (k: string) => void;
  toggleFaculty: (k: string) => void;
  apply: () => void;
  onAfterApply?: () => void;
}) {
  return (
    <>
      <div>
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4 dark:text-neutral-500">
          Жұмыс түрі
        </h4>
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
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors dark:text-neutral-300 dark:group-hover:text-neutral-100">
                  {typeLabels[String(item.key)] ?? String(item.key)}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{item.doc_count}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4 dark:text-neutral-500">
          Факультет
        </h4>
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
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors dark:text-neutral-300 dark:group-hover:text-neutral-100">
                  {(item as Agg & { name?: string }).name ?? String(item.key)}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{item.doc_count}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        className="w-full mt-8"
        type="button"
        onClick={() => {
          apply();
          onAfterApply?.();
        }}
      >
        Қолдану
      </Button>
    </>
  );
}

export function FilterPanel({
  typeBuckets,
  facultyBuckets,
  selectedTypes,
  selectedFaculties,
  toggleType,
  toggleFaculty,
  apply,
  mobileOpen = false,
  onMobileClose,
}: {
  typeBuckets: Agg[];
  facultyBuckets: Agg[];
  selectedTypes: Set<string>;
  selectedFaculties: Set<string>;
  toggleType: (k: string) => void;
  toggleFaculty: (k: string) => void;
  apply: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  return (
    <>
      <aside
        className={cn(
          "hidden md:flex md:flex-col w-[260px] shrink-0 border-r border-neutral-100 p-6 lg:p-8 space-y-8 dark:border-neutral-800 overflow-y-auto",
          "sticky top-14 self-start max-h-[calc(100vh-3.5rem)]"
        )}
      >
        <FilterPanelBody
          typeBuckets={typeBuckets}
          facultyBuckets={facultyBuckets}
          selectedTypes={selectedTypes}
          selectedFaculties={selectedFaculties}
          toggleType={toggleType}
          toggleFaculty={toggleFaculty}
          apply={apply}
        />
      </aside>

      {mobileOpen ?
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            aria-label="Сүзгілерді жабу"
            onClick={() => onMobileClose?.()}
          />
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-[min(100vw-2rem,300px)] overflow-y-auto bg-white border-r border-neutral-100 p-6 shadow-xl md:hidden dark:bg-neutral-900 dark:border-neutral-800"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Сүзгілер</h3>
              <button
                type="button"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                onClick={() => onMobileClose?.()}
              >
                Жабу
              </button>
            </div>
            <div className="space-y-8">
              <FilterPanelBody
                typeBuckets={typeBuckets}
                facultyBuckets={facultyBuckets}
                selectedTypes={selectedTypes}
                selectedFaculties={selectedFaculties}
                toggleType={toggleType}
                toggleFaculty={toggleFaculty}
                apply={apply}
                onAfterApply={() => onMobileClose?.()}
              />
            </div>
          </aside>
        </>
      : null}
    </>
  );
}
