"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Toast } from "@/components/ui/Toast";
import { Select } from "@/components/ui/Select";
import { apiJsonSafe } from "@/lib/fetcher";
import { Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function SupervisorSettingsPage() {
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [faculties, setFaculties] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [avatar, setAvatar] = useState<string>("");
  const [avatarName, setAvatarName] = useState<string>("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [interests, setInterests] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    apiJsonSafe<{
      id?: string;
      name?: string;
      position?: string | null;
      phone?: string | null;
      avatar?: string | null;
      employeeId?: string | null;
      bio?: string | null;
      socialLinks?: string | null;
      interests?: string | null;
      facultyId?: string;
      department?: { id: string } | null;
    }>("/api/auth/me", {}).then((d) => {
      setId(d.id ?? null);
      setName(d.name ?? "");
      setPosition(d.position ?? "");
      setPhone(d.phone ?? "");
      setAvatar(d.avatar ?? "");
      setEmployeeId(d.employeeId ?? "");
      setBio(d.bio ?? "");
      setSocialLinks(d.socialLinks ?? "");
      setInterests(d.interests ?? "");
      setFacultyId(d.facultyId ?? "");
      setDepartmentId(d.department?.id ?? "");
      if (d.facultyId) {
        apiJsonSafe<{ departments?: { id: string; name: string }[] }>(
          `/api/public/departments?facultyId=${d.facultyId}`,
          { departments: [] }
        ).then((x) => setDepartments(x.departments ?? []));
      }
    });
    apiJsonSafe<{ faculties?: { id: string; name: string }[] }>("/api/public/faculties", { faculties: [] }).then(
      (d) => setFaculties((d.faculties ?? []).map((f) => ({ id: f.id, name: f.name })))
    );
  }, []);

  async function onAvatarPick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSaved("Тек сурет файлын таңдаңыз");
      return;
    }
    if (file.size > 1024 * 1024) {
      setSaved("Аватар 1MB-тан аспауы керек");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Файл оқу қате"));
      reader.readAsDataURL(file);
    }).catch(() => "");
    if (!dataUrl) {
      setSaved("Аватар жүктеу сәтсіз");
      return;
    }
    setAvatar(dataUrl);
    setAvatarName(file.name);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    const r = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: name.trim(),
        position: position.trim() || null,
        phone: phone.trim() || null,
        facultyId: facultyId || undefined,
        departmentId: departmentId || undefined,
        employeeId: employeeId.trim() || null,
        bio: bio.trim() || null,
        socialLinks: socialLinks.trim() || null,
        interests: interests.trim() || null,
        avatar: avatar || null,
      }),
    }).catch(() => null);
    setSaved(r?.ok ? "Сақталды" : "Сақтау сәтсіз");
  }

  async function savePassword() {
    if (!id) return;
    if (pwd.newPassword !== pwd.confirmPassword) {
      setPwdMsg("Жаңа құпиясөздер бірдей емес");
      return;
    }
    const r = await fetch(`/api/users/${id}/password`, {
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

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Баптаулар</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Көрініс режимі</p>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Жарық, қараңғы немесе жүйелік режим.
        </p>
        <ThemeToggle className="mt-4" />
      </div>
      {saved ? <Toast variant={saved === "Сақталды" ? "success" : "error"}>{saved}</Toast> : null}
      <form onSubmit={save} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
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
                Компьютерден сурет таңдаңыз (максимум 1MB)
                {avatarName ? ` · ${avatarName}` : ""}
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Аты-жөні</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Қызметі</label>
          <Input value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Телефон</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Қызметтік нөмір</label>
          <Input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Bio</label>
          <textarea
            className="mt-1 w-full min-h-[80px] rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Әлеуметтік сілтеме</label>
          <Input value={socialLinks} onChange={(e) => setSocialLinks(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Ғылыми қызығушылық</label>
          <Input value={interests} onChange={(e) => setInterests(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Факультет</label>
          <Select
            value={facultyId}
            onChange={(e) => {
              setFacultyId(e.target.value);
              setDepartmentId("");
              if (!e.target.value) {
                setDepartments([]);
                return;
              }
              apiJsonSafe<{ departments?: { id: string; name: string }[] }>(
                `/api/public/departments?facultyId=${e.target.value}`,
                { departments: [] }
              ).then((x) => setDepartments(x.departments ?? []));
            }}
            className="mt-1"
          >
            <option value="">—</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Кафедра</label>
          <Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="mt-1">
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          savePassword();
        }}
        className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <h2 className="text-lg font-semibold">Құпиясөзді өзгерту</h2>
        {pwdMsg ? <Toast variant={pwdMsg.includes("емес") || pwdMsg.includes("қате") || pwdMsg.includes("сәтсіз") ? "error" : "success"}>{pwdMsg}</Toast> : null}
        <div>
          <label className="text-xs font-medium text-neutral-500">Ағымдағы құпиясөз</label>
          <div className="relative mt-1">
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
        <div>
          <label className="text-xs font-medium text-neutral-500">Жаңа құпиясөз</label>
          <div className="relative mt-1">
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
        <div>
          <label className="text-xs font-medium text-neutral-500">Жаңа құпиясөзді қайталау</label>
          <Input
            type={showNext ? "text" : "password"}
            value={pwd.confirmPassword}
            onChange={(e) => setPwd((p) => ({ ...p, confirmPassword: e.target.value }))}
            className="mt-1"
          />
        </div>
        <Button type="submit">Құпиясөзді жаңарту</Button>
      </form>
    </div>
  );
}
