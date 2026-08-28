"use client";

import { track } from "@vercel/analytics";
import { useTranslations } from "next-intl";

type BrochureDownloadProps = {
  url: string;
};

export default function BrochureDownload({ url }: BrochureDownloadProps) {
  const t = useTranslations("projects");

  const handleDownload = () => {
    track("brochure_download");
  };

  return (
    <section>
      <h2>{t("brochure")}</h2>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDownload}
      >
        {t("downloadBrochure")}
      </a>
    </section>
  );
}
