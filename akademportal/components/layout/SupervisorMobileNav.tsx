"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, ClipboardList, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Басты", icon: LayoutDashboard, href: "/supervisor" },
  { label: "Іздеу", icon: Search, href: "/supervisor/search" },
  { label: "Тексеру", icon: ClipboardList, href: "/supervisor/assigned" },
  { label: "Студенттер", icon: Users, href: "/supervisor/students" },
  { label: "Профиль", icon: User, href: "/supervisor/profile" },
];

export function SupervisorMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-between z-50 dark:border-neutral-800 dark:bg-neutral-900">
      {ITEMS.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/supervisor" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              active ? "text-primary" : "text-neutral-400 dark:text-neutral-500"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
