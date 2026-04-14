"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Upload, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Басты", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Іздеу", icon: Search, href: "/search" },
  { label: "Жүктеу", icon: Upload, href: "/upload" },
  { label: "Жұмыстарым", icon: FileText, href: "/my-works" },
  { label: "Профиль", icon: User, href: "/profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-between z-50">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              active ? "text-primary" : "text-neutral-400"
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
