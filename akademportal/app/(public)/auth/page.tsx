import { Suspense } from "react";
import AuthClient from "./AuthClient";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-neutral-500">Жүктелуде…</div>}>
      <AuthClient />
    </Suspense>
  );
}
