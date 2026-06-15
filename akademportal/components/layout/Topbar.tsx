"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type TopbarProps = {
  /** Толық іздеу бетінің жолы (студент: /search, жетекші: /supervisor/search) */
  searchBasePath?: string;
};

export function Topbar({ searchBasePath = "/search" }: TopbarProps) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const goSearch = useCallback(() => {
    const t = q.trim();
    router.push(t ? `${searchBasePath}?q=${encodeURIComponent(t)}` : searchBasePath);
  }, [q, router, searchBasePath]);

  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4 md:px-6 lg:px-8 sticky top-0 z-40 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="hidden md:flex flex-1 max-w-xl min-w-0 relative pr-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            goSearch();
          }}
          placeholder="Жылдам іздеу… Enter — толық іздеу беті"
          className="pl-10 h-9 bg-neutral-50 border-none text-sm dark:bg-neutral-800"
          aria-label="Жылдам іздеу"
        />
      </div>
      <div className="flex items-center gap-4 ml-auto shrink-0">
        <ThemeToggle />
        <NotificationBell variant="compact" />
      </div>
    </header>
  );
}
