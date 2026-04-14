export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || res.statusText);
  }
  return res.json() as Promise<T>;
}

/** Same as JSON fetch but never throws; returns fallback if network fails or !ok. */
export async function apiJsonSafe<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(path, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
