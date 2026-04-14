"use client";

import { useEffect, useState } from "react";
import { StudentProfileView } from "@/components/profile/StudentProfileView";

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

  return <StudentProfileView profile={data.profile} stats={data.stats} recentWorks={data.recentWorks} />;
}
