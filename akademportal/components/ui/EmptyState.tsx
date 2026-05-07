import Link from "next/link";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 px-6 py-12 text-center dark:border-neutral-700 dark:bg-neutral-900/70">
      <p className="text-base font-medium text-neutral-800 dark:text-neutral-100">{title}</p>
      {description ?
        <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto dark:text-neutral-400">{description}</p>
      : null}
      {actionLabel && actionHref ?
        <div className="mt-6">
          <Link href={actionHref}>
            <Button>{actionLabel}</Button>
          </Link>
        </div>
      : null}
    </div>
  );
}
