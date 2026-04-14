"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw, Star, X, Bell } from "lucide-react";
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

function RowIcon({ type }: { type: string }) {
  const b = "shrink-0 rounded-full p-2 ";
  if (type === "WORK_APPROVED") return <div className={b + "bg-emerald-100 text-emerald-700"}><Check size={18} /></div>;
  if (type === "WORK_RETURNED") return <div className={b + "bg-amber-100 text-amber-700"}><RotateCcw size={18} /></div>;
  if (type === "WORK_REJECTED") return <div className={b + "bg-red-100 text-red-700"}><X size={18} /></div>;
  if (type === "REVIEW_RECEIVED" || type === "REVIEW") return <div className={b + "bg-blue-100 text-blue-700"}><Star size={18} /></div>;
  return <div className={b + "bg-neutral-100 text-neutral-600"}><Bell size={18} /></div>;
}

export default function SupervisorNotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);

  useEffect(() => {
    apiJsonSafe<{ items?: Row[] }>("/api/supervisor/notifications", { items: [] }).then((d) =>
      setItems(d.items ?? [])
    );
  }, []);

  async function onOpen(n: Row) {
    if (!n.read) {
      await fetch(`/api/notifications/${n.id}/read`, { method: "POST", credentials: "include" });
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    }
    if (n.link) router.push(n.link);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Хабарландырулар</h1>
      <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
        {items.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => onOpen(n)}
              className={`w-full text-left p-4 flex gap-3 items-start transition-colors ${
                n.read ? "bg-white" : "bg-blue-50/50"
              } hover:bg-neutral-50`}
            >
              <RowIcon type={n.type} />
              <div className="min-w-0 flex-1">
                <div className={`font-medium ${n.read ? "text-neutral-700" : "text-neutral-900"}`}>{n.title}</div>
                {n.body ? <p className="text-sm text-neutral-600 mt-1">{n.body}</p> : null}
                <p className="text-xs text-neutral-400 mt-2">{new Date(n.createdAt).toLocaleString("kk-KZ")}</p>
              </div>
              {!n.read ?
                <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2" />
              : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
