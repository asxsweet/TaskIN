"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema } from "@/lib/validations";
import type { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useState } from "react";
import { apiJsonSafe } from "@/lib/fetcher";

type Form = z.infer<typeof userUpdateSchema>;

export default function SettingsPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const form = useForm<Form>({ resolver: zodResolver(userUpdateSchema) });

  useEffect(() => {
    apiJsonSafe<{ name?: string; avatar?: string | null }>("/api/auth/me", {}).then((u) =>
      form.reset({ name: u.name ?? "", avatar: u.avatar ?? "" })
    );
  }, [form]);

  async function onSubmit(values: Form) {
    const me = await apiJsonSafe<{ id?: string }>("/api/auth/me", {});
    if (!me.id) {
      setMsg("Қате");
      return;
    }
    const r = await fetch(`/api/users/${me.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setMsg(r.ok ? "Сақталды" : "Қате");
  }

  return (
    <div className="max-w-xl space-y-6 -m-4 md:-m-8 px-4 md:px-8 py-6">
      <h1 className="text-2xl font-semibold">Баптаулар</h1>
      {msg && <Toast variant={msg === "Сақталды" ? "success" : "error"}>{msg}</Toast>}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg border border-neutral-200">
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Аты-жөні</label>
          <Input {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Аватар URL</label>
          <Input {...form.register("avatar")} />
        </div>
        <Button type="submit">Сақтау</Button>
      </form>
    </div>
  );
}
