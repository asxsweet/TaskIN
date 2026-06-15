"use client";

import { useParams } from "next/navigation";
import { WorkDetailClient } from "@/components/works/WorkDetailClient";

export default function SupervisorWorkDetailPage() {
  const params = useParams();
  const id = String(params.id);
  return (
    <WorkDetailClient
      id={id}
      searchHref="/supervisor/search"
      workHrefPrefix="/supervisor/works"
      showBookmarks={false}
      showReviewForm={false}
    />
  );
}
