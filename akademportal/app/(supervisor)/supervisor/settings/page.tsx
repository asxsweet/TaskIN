"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SupervisorSettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { name?: string }) => setName(d.name ?? ""));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const id = session?.user?.id;
    if (!id) return;
    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    }).catch(() => undefined);
    setSaved(true);
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Баптаулар</h1>
      <form onSubmit={save} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
        <div>
          <label className="text-xs font-medium text-neutral-500">Аты-жөні</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
        </div>
        <Button type="submit">Сақтау</Button>
        {saved ? <p className="text-sm text-green-700">Сақталды</p> : null}
      </form>
    </div>
  );
}
