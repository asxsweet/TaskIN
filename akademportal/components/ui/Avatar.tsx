import { cn } from "@/lib/utils";

export function Avatar({
  src,
  initials,
  size = "md",
  className,
}: {
  src?: string | null;
  initials?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "h-8 w-8 text-[10px]", md: "h-10 w-10 text-xs", lg: "h-14 w-14 text-sm" };
  return (
    <div
      className={cn(
        "rounded-full bg-neutral-100 flex items-center justify-center font-semibold text-neutral-600 overflow-hidden",
        sizes[size],
        className
      )}
    >
      {src ?
        <img src={src} alt="" className="h-full w-full object-cover" />
      : <span>{initials}</span>}
    </div>
  );
}
