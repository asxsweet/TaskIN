export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 p-8">
      <div className="h-8 bg-neutral-100 rounded w-1/3 dark:bg-neutral-800" />
      <div className="h-12 bg-neutral-100 rounded dark:bg-neutral-800" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-40 bg-neutral-100 rounded dark:bg-neutral-800" />
        <div className="h-40 bg-neutral-100 rounded dark:bg-neutral-800" />
      </div>
    </div>
  );
}
