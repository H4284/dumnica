"use client";

import { trackSiteEvent } from "@/components/analytics/trackEvent";
import { useTranslations } from "next-intl";

type BrochureDownloadProps = {
  url: string;
};

export default function BrochureDownload({ url }: BrochureDownloadProps) {
  const t = useTranslations("projects");

  const handleDownload = () => {
    trackSiteEvent("brochure_download");
  };

  return (
    <section className="detail-section">
      <h2>{t("brochure")}</h2>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDownload}
        className="btn btn-primary"
      >
        {t("downloadBrochure")}
      </a>
    </section>
  );
}
