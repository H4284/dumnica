import { headers } from "next/headers";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

export async function getClientIp() {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return requestHeaders.get("x-real-ip")?.trim() || "unknown";
}

export async function checkRateLimit(ip: string): Promise<{
  ok: boolean;
  remaining: number;
}> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    console.warn("[rate-limit] Upstash Redis is not configured.");
    return { ok: true, remaining: MAX_REQUESTS };
  }

  const key = `form:${ip}`;

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, WINDOW_SECONDS],
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[rate-limit] Upstash request failed:", response.status);
      return { ok: true, remaining: MAX_REQUESTS };
    }

    const result = (await response.json()) as Array<{ result: number }>;
    const count = Number(result[0]?.result ?? 0);
    const remaining = Math.max(0, MAX_REQUESTS - count);

    return {
      ok: count <= MAX_REQUESTS,
      remaining,
    };
  } catch (error) {
    console.error("[rate-limit] Upstash error:", error);
    return { ok: true, remaining: MAX_REQUESTS };
  }
}
