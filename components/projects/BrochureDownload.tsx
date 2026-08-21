"use client";

import { track } from "@vercel/analytics";

type BrochureDownloadProps = {
  url: string;
};

export default function BrochureDownload({
  url,
}: BrochureDownloadProps) {
  const handleDownload = () => {
    track("brochure_download");
  };

  return (
    <section>
      <h2>Brochure</h2>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDownload}
      >
        Download Brochure
      </a>
    </section>
  );
}