"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { NotificationBell } from "@/components/layout/NotificationBell";

export function Topbar() {
  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="hidden md:flex flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <Input placeholder="Жылдам іздеу..." className="pl-10 h-9 bg-neutral-50 border-none text-sm" readOnly />
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <NotificationBell variant="compact" />
      </div>
    </header>
  );
}
