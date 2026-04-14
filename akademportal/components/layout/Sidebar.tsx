"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  FileText,
  Upload,
  Bookmark,
  Settings,
  Shield,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { roleLabel } from "@/lib/work-labels";
import { Logo } from "@/components/layout/Logo";

const NAV = [
  { label: "Басқару тақтасы", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Іздеу", icon: Search, href: "/search" },
];

const WORK = [
  { label: "Менің жұмыстарым", icon: FileText, href: "/my-works" },
  { label: "Жүктеу", icon: Upload, href: "/upload" },
  { label: "Бетбелгілер", icon: Bookmark, href: "/bookmarks" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data } = useSession();
  const user = data?.user;

  return (
    <aside className="hidden md:flex w-[240px] border-r border-neutral-200 bg-white flex-col h-screen sticky top-0">
      <div className="p-6">
        <Logo />
      </div>

      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
          <Avatar
            initials={user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
            size="md"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-neutral-900 truncate">{user?.name}</span>
            <Badge variant="tag" className="w-fit mt-1">
              {roleLabel(user?.role ?? "STUDENT")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 space-y-8 overflow-y-auto">
        <div>
          <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">
            Негізгі
          </h4>
          <div className="space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md transition-all group",
                    active ?
                      "bg-primary-tint text-primary border-l-2 border-primary"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={cn(active ? "text-primary" : "text-neutral-400")} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">
            Жұмыстарым
          </h4>
          <div className="space-y-1">
            {WORK.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-all",
                    active ?
                      "bg-primary-tint text-primary border-l-2 border-primary"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {user?.role === "ADMIN" && (
          <div>
            <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">
              Әкімші
            </h4>
            <Link
              href="/admin"
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                pathname.startsWith("/admin") ?
                  "bg-primary-tint text-primary border-l-2 border-primary"
                : "text-neutral-600 hover:bg-neutral-50"
              )}
            >
              <Shield size={18} className="mr-3" />
              <span className="text-sm font-medium">Админ панель</span>
            </Link>
          </div>
        )}

        <div>
          <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">
            Жүйе
          </h4>
          <Link
            href="/settings"
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50",
              pathname === "/settings" && "bg-primary-tint text-primary"
            )}
          >
            <Settings size={18} className="mr-3" />
            <span className="text-sm font-medium">Баптаулар</span>
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left flex items-center px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50"
          >
            <span className="text-sm font-medium">Шығу</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
