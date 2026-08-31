"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import type { UnitsByBuildingQueryResult } from "@/sanity.types";
import { formatFloorLabel, formatOrientation } from "@/lib/i18nLabels";
import { formatEuroPrice, hasUnitPrice } from "@/lib/seo";
import { unitStatusKey } from "@/lib/statusKeys";

import LeadForm from "./LeadForm";
import TrackedExternalLink from "@/components/analytics/TrackedExternalLink";
import { Link } from "@/i18n/navigation";

type Unit = UnitsByBuildingQueryResult[number];

type Props = {
  unit: Unit | null;
  onClose: () => void;
  whatsappNumber: string;
  buildingSlug: string;
};

function getStatusClass(status: Unit["status"]) {
  switch (status) {
    case "i_lire":
      return "unit-status-free";
    case "i_rezervuar":
      return "unit-status-reserved";
    case "i_shitur":
      return "unit-status-sold";
    default:
      return "unit-status-sold";
  }
}

export default function UnitPanel({
  unit,
  onClose,
  whatsappNumber,
  buildingSlug,
}: Props) {
  const t = useTranslations("unit");
  const tAfarizmi = useTranslations("afarizmi");
  const tFloor = useTranslations("floor");
  const tFilters = useTranslations("filters");
  const tStatus = useTranslations("unitStatus");
  const tCommon = useTranslations("common");
  const tLead = useTranslations("lead");
  const locale = useLocale();
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

  const floorLabel = formatFloorLabel(unit.floor, {
    ground: tFloor("ground"),
    n: (n) => tFloor("n", { n }),
  });

  const whatsappMessage = encodeURIComponent(
    tLead("whatsappMessage", { code: unit.code ?? "" }),
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
        className="fixed inset-0 z-[70] bg-black/40"
        aria-hidden="true"
        onClick={handleClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="unit-panel-title"
        className="
          fixed inset-x-0 bottom-0 z-[80]
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

          <span className="sr-only">{t("dragToClose")}</span>
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
              aria-label={tCommon("close")}
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-full
                bg-muted
                text-xl
                text-primary
              "
            >
              ×
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-secondary">{tAfarizmi("rooms")}</p>

              <p className="mt-1 font-semibold text-primary">
                {unit.rooms ?? "-"}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-secondary">{t("net")}</p>

              <p className="mt-1 font-semibold text-primary">
                {unit.areaNet ?? "-"} m²
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-secondary">{t("gross")}</p>

              <p className="mt-1 font-semibold text-primary">
                {unit.areaGross ?? "-"} m²
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-secondary">{t("orientation")}</p>

              <p className="mt-1 font-semibold text-primary">
                {formatOrientation(unit.orientation, {
                  east: tFilters("east"),
                  west: tFilters("west"),
                  north: tFilters("north"),
                  south: tFilters("south"),
                })}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-secondary">{t("price")}</p>

              <p className="mt-1 font-semibold text-primary">
                {hasUnitPrice(unit.price)
                  ? formatEuroPrice(unit.price, locale)
                  : t("priceOnRequest")}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                unit.status,
              )}`}
            >
              {tStatus(unitStatusKey(unit.status))}
            </span>
          </div>

          {floorPlanUrl && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-primary">
                {t("plan")}
              </p>

              <button
                type="button"
              className="
                group relative block w-full
                overflow-hidden rounded-sm
                bg-muted
              "
                onClick={() => {
                  window.open(floorPlanUrl, "_blank");
                }}
              >
                <Image
                  src={floorPlanUrl}
                  alt={t("planAlt", { code: unit.code ?? "" })}
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
                  {t("enlargePlan")}
                </span>
              </button>
            </div>
          )}

          {buildingSlug && unit.code && (
            <Link
              href={`/afarizmi/${buildingSlug}/${unit.code}`}
              className="btn btn-primary mb-3 w-full"
            >
              {t("viewDetails")}
            </Link>
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
                className="btn btn-dark w-full"
              >
                {t("interested")}
              </button>

              <TrackedExternalLink
                event="whatsapp_click"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp w-full"
              >
                {tCommon("whatsapp")}
              </TrackedExternalLink>

              {floorPlanDownloadUrl && (
                <button
                  type="button"
                  onClick={() => {
                    void downloadFloorPlan();
                  }}
                  className="btn btn-ghost w-full"
                >
                  {t("downloadPlan")}
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}