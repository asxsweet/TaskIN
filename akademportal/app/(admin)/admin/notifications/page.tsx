"use client";

import { useEffect, useState } from "react";
import { Bell, Check, RotateCcw, Star, X, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiJsonSafe } from "@/lib/fetcher";

type Row = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
};

function Icon({ type }: { type: string }) {
  const c = "shrink-0 rounded-full p-2 ";
  if (type === "WORK_APPROVED") return <div className={c + "bg-emerald-100 text-emerald-700"}><Check size={18} /></div>;
  if (type === "WORK_RETURNED") return <div className={c + "bg-amber-100 text-amber-700"}><RotateCcw size={18} /></div>;
  if (type === "WORK_REJECTED") return <div className={c + "bg-red-100 text-red-700"}><X size={18} /></div>;
  if (type === "REVIEW_RECEIVED" || type === "REVIEW") return <div className={c + "bg-blue-100 text-blue-700"}><Star size={18} /></div>;
  if (type === "SUPERVISOR_REQUEST") return <div className={c + "bg-violet-100 text-violet-700"}><UserCircle2 size={18} /></div>;
  return <div className={c + "bg-neutral-100 text-neutral-600"}><Bell size={18} /></div>;
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);

  useEffect(() => {
    apiJsonSafe<{ items?: Row[] }>("/api/admin/notifications", { items: [] }).then((d) => setItems(d.items ?? []));
  }, []);

  async function openRow(n: Row) {
    if (!n.read) {
      await fetch(`/api/notifications/${n.id}/read`, { method: "POST", credentials: "include" });
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    }
    if (n.link) router.push(n.link);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-semibold">Хабарландырулар</h1>
      <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
        {items.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              className="w-full text-left p-4 hover:bg-neutral-50 flex gap-3 items-start"
              onClick={() => openRow(n)}
            >
              <Icon type={n.type} />
              <div className="min-w-0 flex-1">
                <div className="font-medium flex items-center gap-2">
                  {n.title}
                  {!n.read && <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />}
                </div>
                {n.body ? <p className="text-sm text-neutral-600 mt-1">{n.body}</p> : null}
                <p className="text-xs text-neutral-400 mt-2">{new Date(n.createdAt).toLocaleString("kk-KZ")}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
