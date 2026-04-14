/**
 * iThenticate / plagiarism API wrapper.
 * When ITHENTICATE_API_KEY is missing or the request fails, returns null (caller shows "Тексерілуде").
 */
export async function checkPlagiarism(fileBuffer: Buffer, fileName: string): Promise<number | null> {
  const key = process.env.ITHENTICATE_API_KEY;
  if (!key) return null;

  try {
    const endpoint = process.env.ITHENTICATE_API_URL || "https://api.example-ithenticate.local/submit";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: fileName,
        contentBase64: fileBuffer.toString("base64").slice(0, 512),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { similarity?: number; score?: number };
    const score = typeof data.similarity === "number" ? data.similarity : data.score;
    if (typeof score === "number" && !Number.isNaN(score)) {
      return Math.min(100, Math.max(0, score));
    }
    return null;
  } catch {
    return null;
  }
}
