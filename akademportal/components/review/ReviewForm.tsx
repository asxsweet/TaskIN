"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewCreateSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { cn } from "@/lib/utils";

const schema = reviewCreateSchema;
type Form = z.infer<typeof schema>;

const CRITERIA: { key: keyof Pick<Form, "relevance" | "methodology" | "formatting" | "conclusion">; label: string }[] = [
  { key: "relevance", label: "Өзектілік" },
  { key: "methodology", label: "Әдістеме" },
  { key: "formatting", label: "Ресімдеу" },
  { key: "conclusion", label: "Мазмұн сапасы" },
];

export function ReviewForm({
  workId,
  onDone,
  className,
}: {
  workId: string;
  onDone?: () => void;
  className?: string;
}) {
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      relevance: 4,
      methodology: 4,
      formatting: 4,
      conclusion: 4,
      strengths: "Күшті жақтары: ",
      suggestions: "Ұсыныстар: ",
      comment: "Жалпы пікір: ",
      decision: "APPROVE",
      returnReason: "",
    },
  });

  const watchAll = form.watch(["relevance", "methodology", "formatting", "conclusion"]);
  const overall =
    (watchAll[0] + watchAll[1] + watchAll[2] + watchAll[3]) / 4;
  const decision = form.watch("decision");

  async function onSubmit(data: Form) {
    const res = await fetch(`/api/works/${workId}/reviews`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || "Қате");
    }
    onDone?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-5", className)}>
      <div className="space-y-3">
        {CRITERIA.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-neutral-700">{label}</span>
            <StarRating
              value={Math.round(form.watch(key) ?? 0)}
              onChange={(v) => form.setValue(key, v, { shouldValidate: true })}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 py-2 border-y border-neutral-100">
        <ScoreRing score={overall} size={72} strokeWidth={4} />
        <div>
          <div className="text-2xl font-bold text-neutral-900">{overall.toFixed(1)}</div>
          <div className="text-xs text-neutral-500">орташа / 5.0</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500">Күшті жақтары *</label>
        <textarea
          className="w-full min-h-[88px] rounded-md border border-neutral-200 px-3 py-2 text-sm"
          {...form.register("strengths")}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500">Ұсыныстар *</label>
        <textarea
          className="w-full min-h-[88px] rounded-md border border-neutral-200 px-3 py-2 text-sm"
          {...form.register("suggestions")}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-500">Пікір (міндетті емес)</label>
        <textarea
          className="w-full min-h-[72px] rounded-md border border-neutral-200 px-3 py-2 text-sm"
          {...form.register("comment")}
        />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-medium text-neutral-500">Шешім *</span>
        <div className="grid grid-cols-1 gap-2">
          {(
            [
              ["APPROVE", "✓ Бекіту", "border-teal-300 bg-teal-50 text-teal-900 hover:bg-teal-100"],
              ["RETURN", "↻ Қайтару", "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"],
              ["REJECT", "✗ Қабылдамау", "border-red-300 bg-red-50 text-red-900 hover:bg-red-100"],
            ] as const
          ).map(([value, label, cls]) => (
            <button
              key={value}
              type="button"
              onClick={() => form.setValue("decision", value, { shouldValidate: true })}
              className={cn(
                "rounded-lg border-2 px-4 py-3 text-left text-sm font-semibold transition-colors",
                cls,
                decision === value && "ring-2 ring-offset-1 ring-blue-500"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(decision === "RETURN" || decision === "REJECT") && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Себебі *</label>
          <textarea
            className="w-full min-h-[80px] rounded-md border border-neutral-200 px-3 py-2 text-sm"
            placeholder="Толтырыңыз…"
            {...form.register("returnReason")}
          />
        </div>
      )}

      <Button type="submit" className="w-full h-12 text-base" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Жіберілуде…" : "Бағалауды жіберу"}
      </Button>
    </form>
  );
}
