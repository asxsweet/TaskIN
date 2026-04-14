"use client";

import { useEffect, useState } from "react";
import { apiJsonSafe } from "@/lib/fetcher";

export function useAdminStats() {
  const [data, setData] = useState<unknown>(null);
  useEffect(() => {
    apiJsonSafe<unknown>("/api/stats/dashboard", null).then(setData);
  }, []);
  return data;
}
