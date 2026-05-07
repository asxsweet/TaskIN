"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema } from "@/lib/validations";
import type { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { apiJsonSafe } from "@/lib/fetcher";
import { Eye, EyeOff } from "lucide-react";

type Form = z.infer<typeof userUpdateSchema>;

export default function SettingsPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState<string>("");
  const [faculties, setFaculties] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const form = useForm<Form>({ resolver: zodResolver(userUpdateSchema) });

  useEffect(() => {
    apiJsonSafe<{
      id?: string;
      name?: string;
      avatar?: string | null;
      facultyId?: string;
      department?: { id: string; name: string } | null;
      phone?: string | null;
      bio?: string | null;
      socialLinks?: string | null;
      interests?: string | null;
    }>("/api/auth/me", {}).then((u) => {
      setMeId(u.id ?? null);
      form.reset({
        name: u.name ?? "",
        avatar: u.avatar ?? "",
        facultyId: u.facultyId ?? "",
        departmentId: u.department?.id ?? "",
        phone: u.phone ?? "",
        bio: u.bio ?? "",
        socialLinks: u.socialLinks ?? "",
        interests: u.interests ?? "",
      });
      if (u.facultyId) {
        apiJsonSafe<{ departments?: { id: string; name: string }[] }>(
          `/api/public/departments?facultyId=${u.facultyId}`,
          { departments: [] }
        ).then((d) => setDepartments(d.departments ?? []));
      }
    });
    apiJsonSafe<{ faculties?: { id: string; name: string }[] }>("/api/public/faculties", { faculties: [] }).then(
      (d) => setFaculties((d.faculties ?? []).map((f) => ({ id: f.id, name: f.name })))
    );
  }, [form]);

  async function onAvatarPick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg("Тек сурет файлын таңдаңыз");
      return;
    }
    if (file.size > 1024 * 1024) {
      setMsg("Аватар 1MB-тан аспауы керек");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Файл оқу қате"));
      reader.readAsDataURL(file);
    }).catch(() => "");
    if (!dataUrl) {
      setMsg("Аватар жүктеу сәтсіз");
      return;
    }
    form.setValue("avatar", dataUrl, { shouldDirty: true });
    setAvatarName(file.name);
  }

  async function onSubmit(values: Form) {
    if (!meId) {
      setMsg("Қате");
      return;
    }
    const payload = {
      ...values,
      phone: values.phone?.trim() || null,
      avatar: values.avatar ?? null,
      facultyId: values.facultyId || undefined,
      departmentId: values.departmentId || undefined,
      bio: values.bio?.trim() || null,
      socialLinks: values.socialLinks?.trim() || null,
      interests: values.interests?.trim() || null,
    };
    const r = await fetch(`/api/users/${meId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMsg(r.ok ? "Сақталды" : "Сақтау кезінде қате");
  }

  async function savePassword() {
    if (!meId) return;
    if (pwd.newPassword !== pwd.confirmPassword) {
      setPwdMsg("Жаңа құпиясөздер бірдей емес");
      return;
    }
    if (pwd.newPassword.length < 8) {
      setPwdMsg("Жаңа құпиясөз кемінде 8 таңба болуы керек");
      return;
    }
    const r = await fetch(`/api/users/${meId}/password`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }),
    });
    if (!r.ok) {
      const t = await r.text();
      setPwdMsg(t || "Құпиясөз жаңарту сәтсіз");
      return;
    }
    setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPwdMsg("Құпиясөз жаңартылды");
  }

  const avatar = form.watch("avatar");
  const initials = (form.watch("name") || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="max-w-xl space-y-6 -m-4 md:-m-6 lg:-m-8 px-4 md:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold">Баптаулар</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Көрініс режимі</p>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Жарық, қараңғы немесе жүйелік режимді таңдаңыз.
        </p>
        <ThemeToggle className="mt-4" />
      </div>
      {msg && <Toast variant={msg === "Сақталды" ? "success" : "error"}>{msg}</Toast>}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 bg-white p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div className="space-y-3">
          <label className="text-xs font-medium text-neutral-500">Аватар</label>
          <div className="flex items-center gap-4">
            <Avatar src={avatar || null} initials={initials} size="lg" />
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => onAvatarPick(e.target.files?.[0])}
              />
              <p className="text-xs text-neutral-500">
                Компьютерден сурет таңдаңыз (PNG/JPG/WEBP/GIF, максимум 1MB)
                {avatarName ? ` · ${avatarName}` : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Аты-жөні</label>
          <Input {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Телефон</label>
          <Input placeholder="+7..." {...form.register("phone")} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Bio</label>
          <textarea className="w-full min-h-[80px] rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" {...form.register("bio")} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Әлеуметтік сілтеме</label>
          <Input placeholder="https://..." {...form.register("socialLinks")} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Ғылыми қызығушылық</label>
          <Input {...form.register("interests")} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Факультет</label>
          <Select
            {...form.register("facultyId")}
            onChange={(e) => {
              form.setValue("facultyId", e.target.value, { shouldDirty: true });
              form.setValue("departmentId", "", { shouldDirty: true });
              if (!e.target.value) {
                setDepartments([]);
                return;
              }
              apiJsonSafe<{ departments?: { id: string; name: string }[] }>(
                `/api/public/departments?facultyId=${e.target.value}`,
                { departments: [] }
              ).then((d) => setDepartments(d.departments ?? []));
            }}
          >
            <option value="">—</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Кафедра</label>
          <Select {...form.register("departmentId")}>
            <option value="">—</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit">Сақтау</Button>
      </form>

      <div className="space-y-4 bg-white p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">Құпиясөзді өзгерту</h2>
        {pwdMsg ? <Toast variant={pwdMsg.includes("сәтсіз") || pwdMsg.includes("емес") || pwdMsg.includes("қате") ? "error" : "success"}>{pwdMsg}</Toast> : null}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Ағымдағы құпиясөз</label>
          <div className="relative">
            <Input
              type={showCurrent ? "text" : "password"}
              value={pwd.currentPassword}
              onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" onClick={() => setShowCurrent((v) => !v)}>
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Жаңа құпиясөз</label>
          <div className="relative">
            <Input
              type={showNext ? "text" : "password"}
              value={pwd.newPassword}
              onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" onClick={() => setShowNext((v) => !v)}>
              {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-500">Жаңа құпиясөзді қайталау</label>
          <Input
            type={showNext ? "text" : "password"}
            value={pwd.confirmPassword}
            onChange={(e) => setPwd((p) => ({ ...p, confirmPassword: e.target.value }))}
          />
        </div>
        <Button type="button" onClick={savePassword}>
          Құпиясөзді жаңарту
        </Button>
      </div>
    </div>
  );
}
