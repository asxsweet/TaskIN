"use client";

import { useEffect, useState } from "react";
import { StudentProfileView } from "@/components/profile/StudentProfileView";
import { Toast } from "@/components/ui/Toast";

type StudentPayload = {
  profile: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    createdAt: string;
    faculty: { id: string; name: string };
    department: { id: string; name: string } | null;
    role: string;
  };
  stats: {
    worksTotal: number;
    worksApproved: number;
    worksPending: number;
    worksReturned: number;
    bookmarkCount: number;
    totalViews: number;
  };
  recentWorks: {
    id: string;
    title: string;
    type: string;
    status: string;
    year: number;
    viewCount: number;
    createdAt: string;
  }[];
};

export default function StudentProfilePage() {
  const [data, setData] = useState<StudentPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/profile", { credentials: "include" });
      if (!res.ok) {
        if (!cancelled) setError("Жүктеу сәтсіз немесе кіру қажет");
        return;
      }
      const d = (await res.json()) as StudentPayload;
      if (cancelled) return;
      if (d.profile.role !== "STUDENT") {
        setError("Бұл бет тек студенттерге арналған.");
        return;
      }
      setData(d);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onAvatarPick(file?: File) {
    if (!file || !data) return;
    setAvatarBusy(true);
    if (!file.type.startsWith("image/")) {
      setMsg("Тек сурет файлын таңдаңыз");
      setAvatarBusy(false);
      return;
    }
    if (file.size > 1024 * 1024) {
      setMsg("Аватар 1MB-тан аспауы керек");
      setAvatarBusy(false);
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Файл оқу қате"));
      reader.readAsDataURL(file);
    }).catch(() => "");
    if (!dataUrl) {
      setAvatarBusy(false);
      return;
    }
    const r = await fetch(`/api/users/${data.profile.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: dataUrl }),
    });
    if (!r.ok) {
      setMsg("Аватар сақтау сәтсіз");
      setAvatarBusy(false);
      return;
    }
    setData((prev) => (prev ? { ...prev, profile: { ...prev.profile, avatar: dataUrl } } : prev));
    setMsg("Аватар жаңартылды");
    setAvatarBusy(false);
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center text-neutral-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-neutral-500 text-sm">
        Жүктелуде…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {msg ? <Toast variant={msg.includes("сәтсіз") ? "error" : "success"}>{msg}</Toast> : null}
      <StudentProfileView
        profile={data.profile}
        stats={data.stats}
        recentWorks={data.recentWorks}
        onAvatarPick={onAvatarPick}
        avatarBusy={avatarBusy}
      />
    </div>
  );
}
