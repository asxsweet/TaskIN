type RateBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateBucket>();

function now() {
  return Date.now();
}

export function hitRateLimit(
  key: string,
  opts: { max: number; windowMs: number }
): { limited: boolean; remaining: number; resetInMs: number } {
  const ts = now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= ts) {
    buckets.set(key, { count: 1, resetAt: ts + opts.windowMs });
    return { limited: false, remaining: opts.max - 1, resetInMs: opts.windowMs };
  }

  current.count += 1;
  buckets.set(key, current);
  const remaining = Math.max(0, opts.max - current.count);
  return {
    limited: current.count > opts.max,
    remaining,
    resetInMs: Math.max(0, current.resetAt - ts),
  };
}
