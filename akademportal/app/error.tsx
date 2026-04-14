"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold text-neutral-900">Бірдеңе қате кетті</h2>
      <p className="text-sm text-neutral-500 max-w-md text-center">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        Қайталау
      </button>
    </div>
  );
}
