import { Suspense } from "react";
import SearchClient from "@/components/works/SearchClient";

export default function SupervisorSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-neutral-500 animate-pulse">Іздеу беті жүктелуде…</div>
      }
    >
      <SearchClient basePath="/supervisor/search" workHrefPrefix="/supervisor/works" />
    </Suspense>
  );
}
