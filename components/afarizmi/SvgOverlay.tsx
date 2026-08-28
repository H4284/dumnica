"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import type { UnitsByBuildingQueryResult } from "@/sanity.types";
import { unitStatusKey } from "@/lib/statusKeys";

type Unit = UnitsByBuildingQueryResult[number];

type Props = {
  viewBox: string;
  units: UnitsByBuildingQueryResult;
  visibleUnitIds?: Set<string>;
  selectedUnit?: Unit | null;
  onSelect?: (unit: Unit) => void;
  onUnitElementReady?: (
    unitId: string,
    element: SVGPathElement,
  ) => void;
};

function getStatusClass(status: Unit["status"]) {
  switch (status) {
    case "i_lire":
      return "fill-green-500/30 hover:fill-green-500/50";
    case "i_rezervuar":
      return "fill-amber-500/30 hover:fill-amber-500/50";
    case "i_shitur":
      return "fill-gray-500/30";
    default:
      return "fill-transparent hover:fill-white/20";
  }
}

export default function SvgOverlay({
  viewBox,
  units,
  visibleUnitIds,
  selectedUnit,
  onSelect,
  onUnitElementReady,
}: Props) {
  const t = useTranslations("afarizmi");
  const tStatus = useTranslations("unitStatus");
  const [previewedUnit, setPreviewedUnit] = useState<Unit | null>(null);

  function getUnitAriaLabel(unit: Unit) {
    const rooms = unit.rooms
      ? t("roomsShort", { count: unit.rooms })
      : t("roomsUndefined");

    const area = unit.areaNet
      ? `${unit.areaNet} m²`
      : t("areaUndefined");

    return t("unitAria", {
      code: unit.code ?? t("noCode"),
      rooms,
      area,
      status: tStatus(unitStatusKey(unit.status)),
    });
  }

  function handleUnitSelect(unit: Unit) {
    if (unit.status === "i_shitur") {
      return;
    }

    if (previewedUnit?._id === unit._id) {
      onSelect?.(unit);
      setPreviewedUnit(null);
      return;
    }

    setPreviewedUnit(unit);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<SVGPathElement>,
    unit: Unit,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (unit.status === "i_shitur") {
        return;
      }

      onSelect?.(unit);
      setPreviewedUnit(null);
    }
  }

  return (
    <>
      <svg
        viewBox={viewBox}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-label={t("selectorLabel")}
      >
        {units.map((unit) => {
          if (!unit.svgPath) {
            return null;
          }

          const isSold = unit.status === "i_shitur";
          const isSelected = selectedUnit?._id === unit._id;

          const isVisible =
            visibleUnitIds === undefined || visibleUnitIds.has(unit._id);

          const isPreviewed = previewedUnit?._id === unit._id;

          return (
            <path
              key={unit._id}
              d={unit.svgPath}
              ref={(element) => {
                if (element) {
                  onUnitElementReady?.(unit._id, element);
                }
              }}
              role="button"
              tabIndex={isVisible && !isSold ? 0 : -1}
              aria-label={getUnitAriaLabel(unit)}
              aria-disabled={isSold}
              className={`
                ${
                  isSelected
                    ? "fill-blue-500/60"
                    : isPreviewed
                      ? "fill-blue-500/40"
                      : getStatusClass(unit.status)
                }
                ${isSold ? "cursor-default" : "cursor-pointer"}
                stroke-white stroke-1 transition-all
                ${isVisible ? "opacity-100" : "opacity-20 grayscale"}
                focus-visible:stroke-blue-600
                focus-visible:stroke-[4]
                focus-visible:opacity-100
              `}
              style={{
                pointerEvents: isVisible && !isSold ? "all" : "none",
              }}
              onMouseEnter={() => {
                if (!isSold && isVisible) {
                  setPreviewedUnit(unit);
                }
              }}
              onMouseLeave={() => {
                setPreviewedUnit(null);
              }}
              onClick={() => {
                if (isSold || !isVisible) {
                  return;
                }

                handleUnitSelect(unit);
              }}
              onKeyDown={(event) => {
                if (isSold || !isVisible) {
                  return;
                }

                handleKeyDown(event, unit);
              }}
            />
          );
        })}
      </svg>

      {previewedUnit && (
        <div
          className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-lg bg-black/80 px-4 py-3 text-sm text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          <p className="font-semibold">
            {previewedUnit.code ?? t("unit")}
          </p>

          <p>
            {previewedUnit.rooms != null
              ? t("roomsShort", { count: previewedUnit.rooms })
              : "—"}{" "}
            · {previewedUnit.areaNet ?? "-"} m²
          </p>

          <p>{tStatus(unitStatusKey(previewedUnit.status))}</p>

          <p className="mt-1 text-xs text-white/70">{t("tapAgain")}</p>
        </div>
      )}
    </>
  );
}