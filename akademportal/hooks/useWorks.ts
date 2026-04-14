"use client";

import { useCallback, useEffect, useState } from "react";
import { apiJsonSafe } from "@/lib/fetcher";

export function useWorksList(url: string) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    apiJsonSafe<unknown>(url, null)
      .then((d) => {
        setData(d);
        if (d === null) setError("error");
      })
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
