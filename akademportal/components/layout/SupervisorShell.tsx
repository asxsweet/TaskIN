"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Bell,
  Users,
  History,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/layout/Logo";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { Topbar } from "@/components/layout/Topbar";
import { SupervisorMobileNav } from "@/components/layout/SupervisorMobileNav";
import { apiJsonSafe } from "@/lib/fetcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const MAIN = [
  { href: "/supervisor", label: "Басқару тақтасы", icon: LayoutDashboard },
  { href: "/supervisor/assigned", label: "Тексеру кезегі", icon: ClipboardList, badge: "assigned" as const },
  { href: "/supervisor/search", label: "Іздеу", icon: Search },
  { href: "/supervisor/notifications", label: "Хабарландырулар", icon: Bell },
];

const STUDENTS = [
  { href: "/supervisor/students", label: "Студенттерім", icon: Users },
  { href: "/supervisor/history", label: "Тексеру тарихы", icon: History },
];

function supervisorSectionTitle(pathname: string | null) {
  const p = pathname || "";
  if (p.startsWith("/supervisor/settings")) return "Баптаулар";
  if (p.startsWith("/supervisor/profile")) return "Профиль";
  if (p.startsWith("/supervisor/students")) return "Студенттерім";
  if (p.startsWith("/supervisor/history")) return "Тексеру тарихы";
  if (p.startsWith("/supervisor/notifications")) return "Хабарландырулар";
  if (p.startsWith("/supervisor/search")) return "Іздеу";
  if (p.startsWith("/supervisor/works")) return "Жұмыс";
  if (p.startsWith("/supervisor/assigned")) return "Тексеру кезегі";
  if (p === "/supervisor" || p === "/supervisor/") return "Басқару тақтасы";
  if (p.startsWith("/supervisor/")) return "Басқару";
  return "Басқару тақтасы";
}

export function SupervisorShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data, status } = useSession();
  const [pendingAssigned, setPendingAssigned] = useState(0);

  useEffect(() => {
    if (status !== "authenticated") return;
    apiJsonSafe<{ items?: unknown[] }>("/api/supervisor/assigned", { items: [] }).then((d) =>
      setPendingAssigned(Array.isArray(d.items) ? d.items.length : 0)
    );
  }, [pathname, status]);

  const supervisorTitle = useMemo(() => supervisorSectionTitle(pathname), [pathname]);

  const fullBleed = pathname?.includes("/supervisor/review/");
  const useSearchLayout =
    pathname?.startsWith("/supervisor/search") || pathname?.startsWith("/supervisor/works/");

  if (fullBleed) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 pb-20 md:pb-0 dark:bg-neutral-950">
      <aside className="hidden md:flex w-[260px] border-r border-neutral-200 bg-white flex-col h-screen sticky top-0 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="p-6">
          <Logo href="/" />
        </div>
        <div className="px-4 mb-4">
          <Link
            href="/supervisor/profile"
            className={cn(
              "flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100 transition-all hover:bg-neutral-100 hover:border-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700",
              pathname === "/supervisor/profile" && "ring-2 ring-violet-500/30 border-violet-200 bg-violet-50/50"
            )}
          >
            <Avatar
              initials={data?.user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
              size="md"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{data?.user?.name}</div>
              <span className="mt-1 inline-flex rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                Жетекші
              </span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase mb-2">Негізгі</p>
            <div className="space-y-1">
              {MAIN.map((l) => {
                const active = pathname === l.href || (l.href !== "/supervisor" && pathname.startsWith(l.href));
                const badge =
                  l.badge === "assigned" && pendingAssigned > 0 ?
                    <span className="ml-auto min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {pendingAssigned > 99 ? "99+" : pendingAssigned}
                    </span>
                  : null;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium border-l-2",
                      active ?
                        "bg-violet-50 text-violet-800 border-violet-600"
                      : "text-neutral-600 hover:bg-neutral-50 border-transparent"
                    )}
                  >
                    <l.icon size={18} />
                    <span className="flex-1">{l.label}</span>
                    {badge}
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase mb-2">Студенттерім</p>
            <div className="space-y-1">
              {STUDENTS.map((l) => {
                const active = pathname === l.href || pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium border-l-2",
                      active ?
                        "bg-violet-50 text-violet-800 border-violet-600"
                      : "text-neutral-600 hover:bg-neutral-50 border-transparent"
                    )}
                  >
                    <l.icon size={18} />
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="space-y-1">
            <Link
              href="/supervisor/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium border-l-2 text-neutral-600 hover:bg-neutral-50",
                pathname.startsWith("/supervisor/settings") ?
                  "bg-violet-50 text-violet-800 border-violet-600"
                : "border-transparent"
              )}
            >
              <Settings size={18} />
              Баптаулар
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              <LogOut size={18} />
              Шығу
            </button>
          </div>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        {useSearchLayout ?
          <Topbar searchBasePath="/supervisor/search" />
        : <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4 md:px-6 lg:px-8 sticky top-0 z-40 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="text-sm text-neutral-500 min-w-0 truncate pr-4">
              <span className="text-neutral-500 dark:text-neutral-400">Жетекші панелі</span>{" "}
              <span className="text-neutral-300 dark:text-neutral-600">/</span>{" "}
              <span className="text-neutral-900 font-medium dark:text-neutral-100">{supervisorTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <NotificationBell variant="compact" />
            </div>
          </header>
        }
        <main className="p-4 md:p-6 lg:p-8 flex-1 min-w-0">{children}</main>
      </div>
      {useSearchLayout ? <SupervisorMobileNav /> : null}
    </div>
  );
}
