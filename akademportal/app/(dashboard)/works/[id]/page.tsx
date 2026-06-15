"use client";

import { useParams } from "next/navigation";
import { WorkDetailClient } from "@/components/works/WorkDetailClient";

export default function WorkDetailPage() {
  const params = useParams();
  const id = String(params.id);
  return <WorkDetailClient id={id} searchHref="/search" />;
}
