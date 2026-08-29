import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type ProtectInput = {
  honeypot?: string | null;
  turnstileToken?: string | null;
};

export type ProtectResult =
  | { ok: true }
  | { ok: false; reason: "honeypot" | "turnstile" | "rate_limit" };

function logBlocked(
  reason: "honeypot" | "turnstile" | "rate_limit",
  ip: string,
) {
  console.info(
    JSON.stringify({
      type: "form_blocked",
      reason,
      ip,
      at: new Date().toISOString(),
    }),
  );
}

export async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY is missing.");
    return false;
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
      cache: "no-store",
    },
  );

  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}

export async function protectForm(
  input: ProtectInput,
): Promise<ProtectResult> {
  const ip = await getClientIp();

  if (input.honeypot && input.honeypot.trim() !== "") {
    logBlocked("honeypot", ip);
    return { ok: false, reason: "honeypot" };
  }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (siteKey && secret) {
    if (!input.turnstileToken) {
      logBlocked("turnstile", ip);
      return { ok: false, reason: "turnstile" };
    }

    const valid = await verifyTurnstile(input.turnstileToken);
    if (!valid) {
      logBlocked("turnstile", ip);
      return { ok: false, reason: "turnstile" };
    }
  } else {
    console.warn("[turnstile] Turnstile is not configured.");
  }

  const rate = await checkRateLimit(ip);
  if (!rate.ok) {
    logBlocked("rate_limit", ip);
    return { ok: false, reason: "rate_limit" };
  }

  return { ok: true };
}
