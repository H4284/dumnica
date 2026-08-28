"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { UnitsByBuildingQueryResult } from "@/sanity.types";

import LeadForm from "./LeadForm";

type Unit = UnitsByBuildingQueryResult[number];

type Props = {
  unit: Unit | null;
  onClose: () => void;
  whatsappNumber: string;
};

function getStatusLabel(status: Unit["status"]) {
  switch (status) {
    case "i_lire":
      return "I lirë";
    case "i_rezervuar":
      return "I rezervuar";
    case "i_shitur":
      return "I shitur";
    default:
      return "Pa status";
  }
}

function getStatusClass(status: Unit["status"]) {
  switch (status) {
    case "i_lire":
      return "bg-green-100 text-green-700";
    case "i_rezervuar":
      return "bg-amber-100 text-amber-700";
    case "i_shitur":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function UnitPanel({
  unit,
  onClose,
  whatsappNumber,
}: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  useEffect(() => {
    if (!unit) {
      return;
    }

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowLeadForm(false);
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [unit, onClose]);

  if (!unit) {
    return null;
  }

  const floorLabel =
    unit.floor === 0
      ? "Përdhesë"
      : unit.floor !== null
        ? `Kati ${unit.floor}`
        : "—";

  const whatsappMessage = encodeURIComponent(
    `Përshëndetje, jam i interesuar për njësinë ${unit.code}`,
  );

  const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, "");

  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`;

  const floorPlanUrl = unit.floorPlanImage?.asset?.url;
  const floorPlanPdfUrl = unit.floorPlanPdf?.asset?.url;
  const floorPlanDownloadUrl = floorPlanPdfUrl ?? floorPlanUrl;
  const floorPlanDownloadName =
    unit.floorPlanPdf?.asset?.originalFilename ??
    `${unit.code ?? "planimetria"}.jpg`;

  async function downloadFloorPlan() {
    if (!floorPlanDownloadUrl) {
      return;
    }

    try {
      const response = await fetch(floorPlanDownloadUrl);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = floorPlanDownloadName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      window.open(floorPlanDownloadUrl, "_blank", "noopener,noreferrer");
    }
  }

  function handleSwipeStart(event: React.TouchEvent<HTMLDivElement>) {
    setSwipeStartY(event.touches[0]?.clientY ?? null);
    setSwipeDistance(0);
  }

  function handleSwipeMove(event: React.TouchEvent<HTMLDivElement>) {
    if (swipeStartY === null) {
      return;
    }

    const currentY = event.touches[0]?.clientY;

    if (currentY === undefined) {
      return;
    }

    const distance = currentY - swipeStartY;

    if (distance > 0) {
      setSwipeDistance(distance);
    }
  }

  function handleSwipeEnd() {
    if (swipeDistance > 100) {
      setShowLeadForm(false);
      onClose();
    }

    setSwipeStartY(null);
    setSwipeDistance(0);
  }

  function handleClose() {
    setShowLeadForm(false);
    onClose();
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        aria-hidden="true"
        onClick={handleClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="unit-panel-title"
        className="
          fixed inset-x-0 bottom-0 z-50
          max-h-[90vh]
          overflow-y-auto
          rounded-t-2xl
          bg-surface
          text-primary
          shadow-2xl
          lg:inset-y-0
          lg:right-0
          lg:left-auto
          lg:w-[440px]
          lg:max-h-none
          lg:rounded-none
          lg:rounded-l-2xl
        "
        style={{
          transform:
            swipeDistance > 0
              ? `translateY(${swipeDistance}px)`
              : undefined,
          transition:
            swipeStartY === null
              ? "transform 150ms ease-out"
              : "none",
        }}
      >
        {/* Mobile drag handle */}
        <div
          className="
            flex
            justify-center
            px-6
            pb-2
            pt-3
            lg:hidden
          "
          onTouchStart={handleSwipeStart}
          onTouchMove={handleSwipeMove}
          onTouchEnd={handleSwipeEnd}
        >
          <div
            className="h-1.5 w-12 rounded-full bg-gray-300"
            aria-hidden="true"
          />

          <span className="sr-only">
            Zvarrit poshtë për ta mbyllur
          </span>
        </div>

        <div className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-secondary">
                {floorLabel}
              </p>

              <h2
                id="unit-panel-title"
                className="mt-1 text-2xl font-bold text-primary"
              >
                {unit.code}
              </h2>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Mbyll"
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-full
                bg-gray-100
                text-xl
                text-gray-700
                transition
                hover:bg-gray-200
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-black
              "
            >
              ×
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-secondary">
                Dhoma
              </p>

              <p className="mt-1 font-semibold text-primary">
                {unit.rooms ?? "-"}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-secondary">
                Neto
              </p>

              <p className="mt-1 font-semibold text-primary">
                {unit.areaNet ?? "-"} m²
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-secondary">
                Bruto
              </p>

              <p className="mt-1 font-semibold text-primary">
                {unit.areaGross ?? "-"} m²
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-secondary">
                Orientimi
              </p>

              <p className="mt-1 font-semibold text-primary">
                {unit.orientation?.length
                  ? unit.orientation.join(", ")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                unit.status,
              )}`}
            >
              {getStatusLabel(unit.status)}
            </span>
          </div>

          {floorPlanUrl && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-primary">
                Planimetria
              </p>

              <button
                type="button"
                className="
                  group relative block w-full
                  overflow-hidden rounded-lg
                  bg-gray-100
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-black
                "
                onClick={() => {
                  window.open(floorPlanUrl, "_blank");
                }}
              >
                <Image
                  src={floorPlanUrl}
                  alt={`Planimetria ${unit.code}`}
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="
                    h-auto w-full
                    transition-transform
                    group-hover:scale-[1.02]
                  "
                />

                <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white">
                  Zmadho planimetrinë
                </span>
              </button>
            </div>
          )}

          {showLeadForm ? (
            <LeadForm
              unitCode={unit.code ?? ""}
              onClose={() => setShowLeadForm(false)}
            />
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowLeadForm(true);
                }}
                className="
                  min-h-11 w-full
                  rounded-lg
                  bg-black
                  px-5 py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-gray-800
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-black
                "
              >
                Interesohem
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  flex min-h-11 w-full
                  items-center justify-center
                  rounded-lg
                  bg-green-600
                  px-5 py-3
                  text-center
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-green-700
                "
              >
                WhatsApp
              </a>

              {floorPlanDownloadUrl && (
                <button
                  type="button"
                  onClick={() => {
                    void downloadFloorPlan();
                  }}
                  className="
                    flex min-h-11 w-full
                    items-center justify-center
                    rounded-lg
                    border border-border
                    bg-surface
                    px-5 py-3
                    text-center
                    text-sm
                    font-semibold
                    text-primary
                    transition
                    hover:bg-muted
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-black
                  "
                >
                  Shkarko planin
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}