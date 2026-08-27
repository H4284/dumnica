"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";


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
      <section ref={galleryRef}>
        <h2>Gallery</h2>

        <div>
          {images.map(
            (image, index) =>
              image.asset?.url && (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Open ${title} gallery image ${index + 1}`}
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
        onClick={() => setSelectedIndex(null)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close gallery"
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
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex(
                (selectedIndex! - 1 + images.length) % images.length,
              );
            }}
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((selectedIndex! + 1) % images.length);
            }}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}