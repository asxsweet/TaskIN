"use client";

import { useEffect, useState } from "react";
import { SupervisorProfileView } from "@/components/profile/SupervisorProfileView";

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
    <SupervisorProfileView profile={data.profile} stats={data.stats} recentReviews={data.recentReviews} />
  );
}
