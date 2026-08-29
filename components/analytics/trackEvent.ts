export const CONSENT_COOKIE = "dumnica_cookie_consent";

export type ConsentValue = "accepted" | "rejected";

export type SiteEvent =
  | "form_submit"
  | "whatsapp_click"
  | "phone_click"
  | "brochure_download"
  | "unit_view"
  | "afarizmi_open";

function hasAcceptedConsent() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split("; ")
    .some((part) => part === `${CONSENT_COOKIE}=accepted`);
}

export function trackSiteEvent(event: SiteEvent) {
  if (!hasAcceptedConsent()) {
    return;
  }

  const gtag = (
    window as Window & {
      gtag?: (...args: unknown[]) => void;
    }
  ).gtag;
  gtag?.("event", event);

  const fbq = (
    window as Window & {
      fbq?: (...args: unknown[]) => void;
    }
  ).fbq;
  fbq?.("trackCustom", event);

  void import("@vercel/analytics").then(({ track }) => {
    track(event);
  });
}
