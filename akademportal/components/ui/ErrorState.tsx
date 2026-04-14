"use client";

import { Button } from "@/components/ui/Button";

export function ErrorState({
  message = "Деректер жүктелмеді",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-100 bg-red-50/80 px-4 py-6 text-center">
      <p className="text-sm text-red-800">{message}</p>
      {onRetry ?
        <Button type="button" variant="secondary" className="mt-4" onClick={onRetry}>
          Қайталап көру
        </Button>
      : null}
    </div>
  );
}
