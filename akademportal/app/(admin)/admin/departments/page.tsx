"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { apiJsonSafe } from "@/lib/fetcher";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";

type Fac = { id: string; name: string };
type Row = { id: string; name: string; facultyId: string; facultyName: string; worksCount: number };

export default function AdminDepartmentsPage() {
  const [faculties, setFaculties] = useState<Fac[]>([]);
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [facultyId, setFacultyId] = useState("");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function loadDeps() {
    const d = await apiJsonSafe<{ items?: Row[] }>(
      facultyId ? `/api/admin/departments?facultyId=${encodeURIComponent(facultyId)}` : "/api/admin/departments",
      { items: [] }
    );
    setItems(d.items ?? []);
  }

  async function loadFaculties() {
    const d = await apiJsonSafe<{ items?: { id: string; name: string }[] }>("/api/admin/faculties", { items: [] });
    const list = d.items ?? [];
    setFaculties(list);
    if (!facultyId && list[0]) setFacultyId(list[0].id);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadFaculties();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) loadDeps();
  }, [facultyId, loading]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!facultyId || !name.trim()) return;
    const r = await fetch("/api/admin/departments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facultyId, name: name.trim() }),
    });
    if (r.ok) {
      setName("");
      loadDeps();
    }
  }

  async function saveEdit(id: string) {
    await fetch(`/api/admin/departments/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    });
    setEditing(null);
    loadDeps();
  }

  async function remove(id: string) {
    if (!confirm("Кафедраны жою керек пе?")) return;
    const r = await fetch(`/api/admin/departments/${id}`, { method: "DELETE", credentials: "include" });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      alert((j as { error?: string }).error || "Қате");
      return;
    }
    loadDeps();
  }

  if (loading) {
    return <SkeletonTable rows={4} cols={4} />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-xl font-semibold">Кафедралар</h1>

      {faculties.length === 0 ?
        <EmptyState title="Алдымен факультет қосыңыз" actionLabel="Факультеттерге өту" actionHref="/admin/faculties" />
      : (
        <>
          <form onSubmit={add} className="flex flex-col sm:flex-row flex-wrap gap-2 items-end rounded-lg border border-neutral-200 bg-white p-4">
            <div>
              <label className="text-xs text-neutral-500">Факультет</label>
              <Select value={facultyId} onChange={(e) => setFacultyId(e.target.value)} className="min-w-[200px]">
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-neutral-500">Кафедра атауы</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button type="submit">+ Қосу</Button>
          </form>

          {items.length === 0 ?
            <EmptyState title="Бұл факультетте кафедра жоқ" />
          : (
            <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Кафедра</th>
                    <th className="px-4 py-3">Факультет</th>
                    <th className="px-4 py-3">Жұмыстар</th>
                    <th className="px-4 py-3 w-40">Әрекет</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((d) => (
                    <tr key={d.id} className="border-t border-neutral-100">
                      <td className="px-4 py-3">
                        {editing === d.id ?
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                        : d.name}
                      </td>
                      <td className="px-4 py-3">{d.facultyName}</td>
                      <td className="px-4 py-3">{d.worksCount}</td>
                      <td className="px-4 py-3 space-x-2">
                        {editing === d.id ?
                          <>
                            <Button type="button" size="sm" onClick={() => saveEdit(d.id)}>
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
                                setEditing(d.id);
                                setEditName(d.name);
                              }}
                            >
                              Өңдеу
                            </Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => remove(d.id)}>
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
        </>
      )}
    </div>
  );
}
