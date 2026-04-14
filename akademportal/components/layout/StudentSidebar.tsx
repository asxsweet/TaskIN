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
  Bell,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { apiJsonSafe } from "@/lib/fetcher";

const MAIN = [
  { label: "Басты бет", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Іздеу", icon: Search, href: "/search" },
  { label: "Хабарландырулар", icon: Bell, href: "/notifications", badge: true as const },
];

const WORK = [
  { label: "Менің жұмыстарым", icon: FileText, href: "/my-works" },
  { label: "Жүктеу", icon: Upload, href: "/upload" },
  { label: "Жинақтарым", icon: Bookmark, href: "/bookmarks" },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const { data } = useSession();
  const user = data?.user;
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    apiJsonSafe<{ unread?: number }>("/api/student/notifications", { unread: 0 }).then((d) =>
      setUnread(d.unread ?? 0)
    );
  }, [pathname]);

  return (
    <aside className="hidden md:flex w-[240px] border-r border-neutral-200 bg-white flex-col h-screen sticky top-0">
      <div className="p-6">
        <Logo href="/" />
      </div>

      <div className="px-4 mb-6">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100 transition-all hover:bg-neutral-100 hover:border-neutral-200",
            pathname === "/profile" && "ring-2 ring-blue-500/30 border-blue-200 bg-blue-50/50"
          )}
        >
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
            <span className="mt-1 inline-flex w-fit rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
              Студент
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-3 space-y-8 overflow-y-auto">
        <div>
          <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">
            Негізгі
          </h4>
          <div className="space-y-1">
            {MAIN.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md transition-all",
                    active ?
                      "bg-blue-50 text-blue-700 border-l-2 border-blue-600"
                    : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {"badge" in item && item.badge && unread > 0 ?
                    <span className="min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  : null}
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
                      "bg-blue-50 text-blue-700 border-l-2 border-blue-600"
                    : "text-neutral-600 hover:bg-neutral-50"
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

        <div>
          <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">
            Аккаунт
          </h4>
          <Link
            href="/settings"
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50",
              pathname === "/settings" && "bg-blue-50 text-blue-700 border-l-2 border-blue-600"
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
            <LogOut size={18} className="mr-3" />
            <span className="text-sm font-medium">Шығу</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
