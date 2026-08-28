"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

type LocationMapProps = {
  latitude?: number;
  longitude?: number;
};

export default function LocationMap({
  latitude,
  longitude,
}: LocationMapProps) {
  const t = useTranslations("projects");
  const [showMap, setShowMap] = useState(false);

  if (latitude === undefined || longitude === undefined) {
    return null;
  }

  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;

  return (
    <section>
      <h2>{t("location")}</h2>

      {!showMap ? (
        <button
          type="button"
          onClick={() => setShowMap(true)}
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            maxWidth: "800px",
            height: "400px",
            padding: 0,
            border: 0,
            cursor: "pointer",
            overflow: "hidden",
          }}
          aria-label={t("openMap")}
        >
          <Image
            src="/images/map-placeholder.png"
            alt={t("mapTitle")}
            fill
            sizes="(max-width: 800px) 100vw, 800px"
            style={{ objectFit: "cover" }}
          />

          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--color-dark-surface)",
              color: "var(--color-dark-text)",
              padding: "12px 20px",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            {t("viewMap")}
          </span>
        </button>
      ) : (
        <iframe
          src={mapUrl}
          title={t("mapTitle")}
          width="100%"
          height="450"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
          allowFullScreen
        />
      )}
    </section>
  );
}
