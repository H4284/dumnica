"use client";

import { useTranslations } from "next-intl";

import { useConsent } from "@/components/analytics/ConsentProvider";

export default function CookieBanner() {
  const t = useTranslations("cookies");
  const { consent, ready, accept, reject } = useConsent();

  if (!ready || consent !== null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="cookie-banner"
    >
      <div className="site-container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="cookie-banner-title" className="text-base font-semibold">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-secondary">{t("body")}</p>
        </div>

        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={reject} className="btn btn-ghost">
            {t("reject")}
          </button>
          <button type="button" onClick={accept} className="btn btn-dark">
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
