import type { ReactNode } from "react";
import { SupervisorShell } from "@/components/layout/SupervisorShell";

export default function SupervisorGroupLayout({ children }: { children: ReactNode }) {
  return <SupervisorShell>{children}</SupervisorShell>;
}
