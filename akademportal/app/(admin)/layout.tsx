"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Star,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  Building2,
  Layers,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/layout/Logo";
import { NotificationBell } from "@/components/layout/NotificationBell";

const MAIN = [
  { href: "/admin", label: "Шолу", icon: LayoutDashboard },
  { href: "/admin/approvals", label: "Жетекші өтінімдері", icon: UserCheck, badgeKey: "approvals" as const },
  { href: "/admin/faculties", label: "Факультеттер", icon: Building2 },
  { href: "/admin/departments", label: "Кафедралар", icon: Layers },
  { href: "/admin/works", label: "Барлық жұмыстар", icon: FileText },
  { href: "/admin/users", label: "Пайдаланушылар", icon: Users },
  { href: "/admin/ratings", label: "Бағалаулар", icon: Star },
];

const SYSTEM = [
  { href: "/admin/reports", label: "Есептер", icon: BarChart3 },
  { href: "/admin/settings", label: "Баптаулар", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data } = useSession();
  const [pendingApprovals, setPendingApprovals] = useState(0);

  useEffect(() => {
    fetch("/api/admin/approvals?filter=pending", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { stats?: { pendingCount?: number } } | null) =>
        setPendingApprovals(d?.stats?.pendingCount ?? 0)
      )
      .catch(() => undefined);
  }, [pathname]);

  if (data?.user?.role && data.user.role !== "ADMIN") {
    return <div className="p-8 text-red-600">Рұқсат жоқ</div>;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden md:flex w-[260px] border-r border-neutral-200 bg-white flex-col h-screen sticky top-0">
        <div className="p-6">
          <Logo href="/" />
        </div>
        <div className="px-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
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
              <span className="mt-1 inline-flex rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                Әкімші
              </span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase mb-2">Басқару</p>
            <div className="space-y-1">
              {MAIN.map((l) => {
                const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
                const badge =
                  "badgeKey" in l && l.badgeKey === "approvals" && pendingApprovals > 0 ?
                    <span className="ml-auto min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {pendingApprovals > 99 ? "99+" : pendingApprovals}
                    </span>
                  : null;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                      active ? "bg-red-50 text-red-900 border-l-2 border-red-600" : "text-neutral-600 hover:bg-neutral-50"
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
            <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase mb-2">Жүйе</p>
            <div className="space-y-1">
              {SYSTEM.map((l) => {
                const active = pathname === l.href || pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                      active ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
                    )}
                  >
                    <l.icon size={18} />
                    {l.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                <LogOut size={18} />
                Шығу
              </button>
            </div>
          </div>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="text-sm text-neutral-500">
            Әкімші панель <span className="text-neutral-300">/</span>{" "}
            <span className="text-neutral-900 font-medium">Басқару</span>
          </div>
          <NotificationBell variant="compact" />
        </header>
        <main className="p-4 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
