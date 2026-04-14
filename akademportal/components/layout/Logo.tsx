import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  size?: "sm" | "md";
  /** inverse: ақ фондағы градиент үшін (auth сол жақ панелі) */
  variant?: "default" | "inverse";
  className?: string;
  /** Логотиптің астындағы қысқа сипат */
  showTagline?: boolean;
};

export function Logo({
  href,
  size = "md",
  variant = "default",
  className,
  showTagline = true,
}: LogoProps) {
  const inverse = variant === "inverse";
  const box = size === "sm" ? 28 : 32;
  const fs = size === "sm" ? 14 : 16;
  const titleFs = size === "sm" ? 13 : 14;

  const inner = (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: box,
          height: box,
          background: inverse ? "rgba(255,255,255,0.2)" : "#1E52CC",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 600,
          fontSize: fs,
          flexShrink: 0,
        }}
      >
        T
      </div>
      <div>
        <div
          style={{
            fontSize: titleFs,
            fontWeight: 500,
            color: inverse ? "#fff" : "#171717",
          }}
        >
          Task IN
        </div>
        {showTagline ?
          <div
            style={{
              fontSize: 10,
              color: inverse ? "rgba(255,255,255,0.75)" : "#737373",
            }}
          >
            Білім беру жүйесі
          </div>
        : null}
      </div>
    </div>
  );

  if (href != null && href !== "") {
    return (
      <Link href={href} className={cn("inline-flex", className)}>
        {inner}
      </Link>
    );
  }

  return <div className={cn("inline-flex", className)}>{inner}</div>;
}
