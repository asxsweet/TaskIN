"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiJsonSafe } from "@/lib/fetcher";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";

type Row = { id: string; name: string; departmentsCount: number; worksCount: number };

export default function AdminFacultiesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function load() {
    setLoading(true);
    const d = await apiJsonSafe<{ items?: Row[] }>("/api/admin/faculties", { items: [] });
    setItems(d.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const r = await fetch("/api/admin/faculties", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (r.ok) {
      setName("");
      load();
    }
  }

  async function saveEdit(id: string) {
    await fetch(`/api/admin/faculties/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    });
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Факультетті жою керек пе?")) return;
    const r = await fetch(`/api/admin/faculties/${id}`, { method: "DELETE", credentials: "include" });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      alert((j as { error?: string }).error || "Қате");
      return;
    }
    load();
  }

  if (loading) {
    return <SkeletonTable rows={4} cols={4} />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-xl font-semibold">Факультеттер</h1>

      <form onSubmit={add} className="flex flex-wrap gap-2 items-end rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-neutral-500">Жаңа факультет атауы</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Мысалы: Инженерлік" />
        </div>
        <Button type="submit">+ Қосу</Button>
      </form>

      {items.length === 0 ?
        <EmptyState title="Факультеттер жоқ" description="Студент жүктеу формасы үшін алдымен факультет пен кафедра қосыңыз." />
      : (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Атауы</th>
                <th className="px-4 py-3">Кафедралар</th>
                <th className="px-4 py-3">Жұмыстар</th>
                <th className="px-4 py-3 w-40">Әрекет</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">
                    {editing === f.id ?
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                    : f.name}
                  </td>
                  <td className="px-4 py-3">{f.departmentsCount}</td>
                  <td className="px-4 py-3">{f.worksCount}</td>
                  <td className="px-4 py-3 space-x-2">
                    {editing === f.id ?
                      <>
                        <Button type="button" size="sm" onClick={() => saveEdit(f.id)}>
                          Сақтау
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}>
                          Болдырмау
                        </Button>
                      </>
                    : <>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditing(f.id);
                            setEditName(f.name);
                          }}
                        >
                          Өңдеу
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => remove(f.id)}>
                          Жою
                        </Button>
                      </>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
