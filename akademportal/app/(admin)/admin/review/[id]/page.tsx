"use client";

import { useParams } from "next/navigation";
import { ReviewForm } from "@/components/review/ReviewForm";

export default function AdminReviewPage() {
  const params = useParams();
  const id = String(params.id);
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">Шолу</h1>
      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
        <ReviewForm workId={id} onDone={() => history.back()} />
      </div>
    </div>
  );
}
