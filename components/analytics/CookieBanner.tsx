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
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-surface p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="cookie-banner-title" className="text-base font-semibold">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-secondary">{t("body")}</p>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
