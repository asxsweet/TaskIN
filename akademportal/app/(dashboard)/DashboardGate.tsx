"use client";

import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";

export function DashboardGate({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (status !== "authenticated" || !role) return;
    if (role === "SUPERVISOR") {
      router.replace("/supervisor");
      return;
    }
    if (role === "ADMIN") {
      router.replace("/admin");
      return;
    }
  }, [status, role, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-500 text-sm">
        Жүктелуде…
      </div>
    );
  }

  if (role && role !== "STUDENT") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-500 text-sm">
        Бағыттау…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 pb-20 md:pb-0">
      <StudentSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-4 md:p-8 flex-1">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
