"use client";

import { useEffect, useState } from "react";
import { SupervisorProfileView } from "@/components/profile/SupervisorProfileView";
import { Toast } from "@/components/ui/Toast";

type SupPayload = {
  profile: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    createdAt: string;
    faculty: { id: string; name: string };
    department: { id: string; name: string } | null;
    role: string;
    position: string | null;
    phone: string | null;
    employeeId: string | null;
    approvalStatus: string;
    approvedAt: string | null;
  };
  stats: {
    supervisedWorksCount: number;
    reviewsTotal: number;
    reviewsThisMonth: number;
    studentsCount: number;
    pendingQueue: number;
  };
  recentReviews: {
    id: string;
    title: string;
    type: string;
    studentName: string;
    workId: string;
    overallScore: number;
    decision: string;
    createdAt: string;
  }[];
};

export default function SupervisorProfilePage() {
  const [data, setData] = useState<SupPayload | null>(null);
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
      const d = (await res.json()) as SupPayload;
      if (cancelled) return;
      if (d.profile.role !== "SUPERVISOR") {
        setError("Бұл бет тек жетекшілерге арналған.");
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
      <SupervisorProfileView
        profile={data.profile}
        stats={data.stats}
        recentReviews={data.recentReviews}
        onAvatarPick={onAvatarPick}
        avatarBusy={avatarBusy}
      />
    </div>
  );
}
