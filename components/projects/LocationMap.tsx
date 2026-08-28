"use client";

import Image from "next/image";
import { useState } from "react";

type LocationMapProps = {
  latitude?: number;
  longitude?: number;
};

export default function LocationMap({
  latitude,
  longitude,
}: LocationMapProps) {
  const [showMap, setShowMap] = useState(false);

  if (latitude === undefined || longitude === undefined) {
    return null;
  }

  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;

  return (
    <section>
      <h2>Location</h2>

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
          aria-label="Open project location map"
        >
          <Image
            src="/images/map-placeholder.png"
            alt="Project location map"
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
            View map
          </span>
        </button>
      ) : (
        <iframe
          src={mapUrl}
          title="Project location"
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