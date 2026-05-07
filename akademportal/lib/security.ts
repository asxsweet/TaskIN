const SCRIPT_TAG_RE = /<\s*\/?\s*script\b[^>]*>/gi;

export function sanitizeText(input: string | null | undefined) {
  if (!input) return input ?? "";
  return input.replace(SCRIPT_TAG_RE, "").trim();
}

export function hasStrongPassword(password: string) {
  if (password.length < 10) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

export function isStateChanging(method: string) {
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}
