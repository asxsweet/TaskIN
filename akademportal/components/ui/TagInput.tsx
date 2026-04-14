"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { X } from "lucide-react";

export function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {value.map((t) => (
          <Badge key={t} variant="tag" className="gap-1 pr-1">
            {t}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== t))}>
              <X size={12} />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const t = draft.trim();
            if (t && !value.includes(t)) onChange([...value, t]);
            setDraft("");
          }
        }}
        placeholder="Кілт сөз және Enter"
      />
    </div>
  );
}
