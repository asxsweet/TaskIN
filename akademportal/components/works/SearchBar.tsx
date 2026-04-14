"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function SearchBar({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="relative flex-1">
      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
      <Input
        className="pl-12 h-12 text-base shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Тақырып, автор, кілт сөз..."
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        >
          <X size={20} />
        </button>
      )}
      <button type="button" className="sr-only" onClick={onSearch}>
        search
      </button>
    </div>
  );
}
