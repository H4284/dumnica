"use client";

import { useState } from "react";

import type { UnitsByBuildingQueryResult } from "@/sanity.types";

type Unit = UnitsByBuildingQueryResult[number];

type Props = {
  viewBox: string;
  units: UnitsByBuildingQueryResult;
  selectedUnit?: Unit | null;
  onSelect?: (unit: Unit) => void;
  onUnitElementReady?: (unitId: string, element: SVGPathElement) => void;
};

function getStatusClass(status: Unit["status"]) {
  switch (status) {
    case "i_lire":
      return "fill-green-500/30 hover:fill-green-500/50";

    case "i_rezervuar":
      return "fill-amber-500/30 hover:fill-amber-500/50";

    case "i_shitur":
      return "fill-gray-500/30 hover:fill-gray-500/50";

    default:
      return "fill-transparent hover:fill-white/20";
  }
}

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

export default function SvgOverlay({
  viewBox,
  units,
  selectedUnit,
  onSelect,
  onUnitElementReady,
}: Props) {
  const [hoveredUnit, setHoveredUnit] = useState<Unit | null>(null);

  return (
    <>
      <svg
        viewBox={viewBox}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        {units.map((unit) => {
          if (!unit.svgPath) {
            return null;
          }

          const isSold = unit.status === "i_shitur";
          const isSelected = selectedUnit?._id === unit._id;
          
          return (
            <path
            key={unit._id}
            d={unit.svgPath}
            ref={(element) => {
              if (element) {
                onUnitElementReady?.(unit._id, element);
              }
            }}
            tabIndex={isSold ? -1 : 0}
            className={`${
              isSelected
                ? "fill-blue-500/60"
                : getStatusClass(unit.status)
            } ${
              isSold ? "cursor-default" : "cursor-pointer"
            } stroke-white stroke-1 transition-colors`}
            style={{
              pointerEvents: "all",
            }}
            onMouseEnter={() => setHoveredUnit(unit)}
            onMouseLeave={() => setHoveredUnit(null)}
            onClick={() => {
              if (isSold) return;
          
              onSelect?.(unit);
            }}
            onKeyDown={(event) => {
              if (isSold) return;
          
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.(unit);
              }
            }}
          />
          );
        })}
      </svg>

      {hoveredUnit && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-lg bg-black/80 px-4 py-3 text-sm text-white shadow-lg">
          <p className="font-semibold">{hoveredUnit.code}</p>

          <p>
            {hoveredUnit.rooms ?? "-"} dhoma ·{" "}
            {hoveredUnit.areaNet ?? "-"} m²
          </p>

          <p>{getStatusLabel(hoveredUnit.status)}</p>
        </div>
      )}
    </>
  );
}