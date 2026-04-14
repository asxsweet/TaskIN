"use client";

export function TypeDonut({
  types,
  total,
}: {
  types: { type: string; count: number; percent: number }[];
  total: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center relative py-6">
      <div className="h-40 w-40 rounded-full border-[12px] border-neutral-100 relative flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-[10px] text-neutral-400 uppercase">Жалпы</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        {types.slice(0, 4).map((t) => (
          <div key={t.type} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-neutral-600">
              {t.type} ({t.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
