"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { apiJsonSafe } from "@/lib/fetcher";

export default function StudentNotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<
    { id: string; type: string; title: string; body: string | null; read: boolean; link: string | null }[]
  >([]);

  useEffect(() => {
    apiJsonSafe<{ items?: typeof items }>("/api/student/notifications", { items: [] }).then((d) =>
      setItems(d.items ?? [])
    );
  }, []);

  async function onOpen(id: string, link: string | null) {
    await fetch(`/api/student/notifications/${id}/read`, { method: "PATCH", credentials: "include" });
    if (link) router.push(link);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Хабарландырулар</h1>
      <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
        {items.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              className="w-full text-left p-4 hover:bg-neutral-50 flex gap-3"
              onClick={() => onOpen(n.id, n.link)}
            >
              <div className="mt-0.5 rounded-full bg-blue-100 p-2 text-blue-700">
                <Bell size={18} />
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  {n.title}
                  {!n.read ? <span className="h-2 w-2 rounded-full bg-blue-600" /> : null}
                </div>
                {n.body ? <p className="text-sm text-neutral-600 mt-1">{n.body}</p> : null}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
