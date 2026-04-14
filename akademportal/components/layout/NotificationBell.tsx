"use client";

import { Bell, Check, RotateCcw, Star, X, UserCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { apiJsonSafe } from "@/lib/fetcher";

type NotifItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "жаңа ғана";
  if (m < 60) return `${m} минут бұрын`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} сағат бұрын`;
  return d.toLocaleDateString("kk-KZ");
}

function notifApi(role: string | undefined) {
  if (role === "ADMIN") return "/api/admin/notifications";
  if (role === "SUPERVISOR") return "/api/supervisor/notifications";
  return "/api/student/notifications";
}

function seeAllPath(role: string | undefined) {
  if (role === "ADMIN") return "/admin/notifications";
  if (role === "SUPERVISOR") return "/supervisor/notifications";
  return "/notifications";
}

function TypeIcon({ type }: { type: string }) {
  const wrap = "mt-0.5 shrink-0 rounded-full p-1.5 flex items-center justify-center";
  if (type === "WORK_APPROVED")
    return (
      <div className={`${wrap} bg-emerald-100 text-emerald-700`}>
        <Check size={16} />
      </div>
    );
  if (type === "INFO")
    return (
      <div className={`${wrap} bg-neutral-100 text-neutral-600`}>
        <Bell size={16} />
      </div>
    );
  if (type === "WORK_RETURNED")
    return (
      <div className={`${wrap} bg-amber-100 text-amber-700`}>
        <RotateCcw size={16} />
      </div>
    );
  if (type === "WORK_REJECTED")
    return (
      <div className={`${wrap} bg-red-100 text-red-700`}>
        <X size={16} />
      </div>
    );
  if (type === "REVIEW_RECEIVED" || type === "REVIEW" || type === "WORK")
    return (
      <div className={`${wrap} bg-blue-100 text-blue-700`}>
        <Star size={16} />
      </div>
    );
  if (type === "SUPERVISOR_REQUEST")
    return (
      <div className={`${wrap} bg-violet-100 text-violet-700`}>
        <UserCircle2 size={16} />
      </div>
    );
  return (
    <div className={`${wrap} bg-neutral-100 text-neutral-600`}>
      <Bell size={16} />
    </div>
  );
}

type Props = { variant?: "default" | "compact" };

export function NotificationBell({ variant = "default" }: Props) {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const api = notifApi(role);
  const seeAllHref = seeAllPath(role);
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  function loadNotifs() {
    apiJsonSafe<{ unread?: number; items?: NotifItem[] }>(api, { unread: 0, items: [] }).then((d) => {
      setUnread(d.unread ?? 0);
      setItems((d.items ?? []).slice(0, 5));
    });
  }

  useEffect(() => {
    if (status !== "authenticated" || !role) return;
    loadNotifs();
  }, [status, role, api]);

  useEffect(() => {
    if (status !== "authenticated" || !role) return;
    const t = setInterval(loadNotifs, 60_000);
    return () => clearInterval(t);
  }, [status, role, api]);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function markOneRead(id: string) {
    if (role === "STUDENT") {
      await fetch(`/api/student/notifications/${id}/read`, { method: "PATCH", credentials: "include" });
    } else {
      await fetch(`/api/notifications/${id}/read`, { method: "POST", credentials: "include" });
    }
  }

  async function onNotifClick(n: NotifItem) {
    if (!n.read) {
      await markOneRead(n.id);
      loadNotifs();
    }
    const path =
      n.link ||
      (n.type === "SUPERVISOR_REQUEST" ? "/admin/approvals"
      : role === "SUPERVISOR" ? "/supervisor"
      : "/dashboard");
    router.push(path);
    setOpen(false);
  }

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "PATCH", credentials: "include" });
    loadNotifs();
  }

  return (
    <div className={`relative ${variant === "compact" ? "" : ""}`} ref={ref}>
      <button
        type="button"
        className={`relative text-neutral-400 hover:text-neutral-600 p-1 ${variant === "compact" ? "text-neutral-500" : ""}`}
        aria-label="notifications"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          loadNotifs();
        }}
      >
        <Bell size={variant === "compact" ? 20 : 18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-0.5 rounded-full bg-danger text-white text-[10px] flex items-center justify-center font-semibold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[min(100vw-2rem,22rem)] rounded-lg border border-neutral-200 bg-white shadow-lg z-50 overflow-hidden">
          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
            {items.length === 0 ?
              <div className="p-4 text-sm text-neutral-500">Хабарландыру жоқ</div>
            : items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => onNotifClick(n)}
                  className="w-full text-left p-3 hover:bg-neutral-50 flex gap-3 items-start"
                >
                  <TypeIcon type={n.type} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-neutral-900 flex items-center gap-2">
                      {n.title}
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    {n.body ?
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">{n.body}</p>
                    : null}
                    <p className="text-[10px] text-neutral-400 mt-1">{formatTime(n.createdAt)}</p>
                  </div>
                </button>
              ))
            }
          </div>
          <div className="border-t border-neutral-100 p-2 flex flex-col gap-1 bg-neutral-50/80">
            <Link
              href={seeAllHref}
              className="text-center text-xs font-medium text-primary py-2 hover:underline"
              onClick={() => setOpen(false)}
            >
              Барлық хабарландырулар
            </Link>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => {
                  markAllRead();
                }}
                className="text-center text-xs text-neutral-600 py-1 hover:text-neutral-900"
              >
                Барлығын оқылды деп белгілеу
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
