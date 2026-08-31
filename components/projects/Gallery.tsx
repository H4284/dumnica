"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type GalleryImage = {
  asset?: {
    url?: string | null;
  } | null;
};

type GalleryProps = {
  images: GalleryImage[];
  title: string;
};

export default function Gallery({ images, title }: GalleryProps) {
  const t = useTranslations("projects");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const selectedImage =
    selectedIndex !== null ? images[selectedIndex] : null;

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || selectedIndex === null) {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    const minimumSwipeDistance = 50;

    if (Math.abs(difference) >= minimumSwipeDistance) {
      if (difference > 0) {
        setSelectedIndex((current) =>
          current === null ? 0 : (current + 1) % images.length,
        );
      } else {
        setSelectedIndex((current) =>
          current === null
            ? 0
            : (current - 1 + images.length) % images.length,
        );
      }
    }

    touchStartX.current = null;
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? 0 : (current + 1) % images.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? 0
            : (current - 1 + images.length) % images.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, images.length]);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <section ref={galleryRef} className="detail-section">
        <h2>{t("gallery")}</h2>

        <div className="gallery-grid">
          {images.map(
            (image, index) =>
              image.asset?.url && (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={t("openGalleryImage", {
                    index: index + 1,
                    title,
                  })}
                >
                  <Image
                    src={image.asset.url}
                    alt={`${title} ${index + 1}`}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </button>
              ),
          )}
        </div>
      </section>

      {selectedImage?.asset?.url && (
        <div
          role="dialog"
          aria-modal="true"
          className="gallery-lightbox"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="gallery-close"
            onClick={() => setSelectedIndex(null)}
            aria-label={t("closeGallery")}
          >
            ×
          </button>

          <Image
            src={selectedImage.asset.url}
            alt={`${title} ${selectedIndex! + 1}`}
            width={1600}
            height={1000}
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />

          <button
            type="button"
            className="gallery-nav prev"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex(
                (selectedIndex! - 1 + images.length) % images.length,
              );
            }}
            aria-label={t("previousImage")}
          >
            ←
          </button>

          <button
            type="button"
            className="gallery-nav next"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((selectedIndex! + 1) % images.length);
            }}
            aria-label={t("nextImage")}
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
