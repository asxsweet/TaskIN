"use client";

import { useState } from "react";

export function useReviewSubmit(workId: string) {
  const [loading, setLoading] = useState(false);
  async function submit(body: Record<string, unknown>) {
    setLoading(true);
    try {
      const r = await fetch(`/api/works/${workId}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    } finally {
      setLoading(false);
    }
  }
  return { submit, loading };
}
