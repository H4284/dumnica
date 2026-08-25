"use client";

import Image from "next/image";
import { useState } from "react";

import SvgOverlay from "./SvgOverlay";

import type {
  BuildingBySlugQueryResult,
  UnitsByBuildingQueryResult,
} from "@/sanity.types";

type Building = NonNullable<BuildingBySlugQueryResult>;
type Unit = UnitsByBuildingQueryResult[number];

type Props = {
  buildingTitle: string;
  facadeImage: NonNullable<Building["facadeImage"]>;
  facadeViewBox: string;
  units: UnitsByBuildingQueryResult;
  selectedUnit?: Unit | null;
  onSelectUnit?: (unit: Unit) => void;
  onUnitElementReady?: (
    unitId: string,
    element: SVGPathElement,
  ) => void;
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

export default function FacadeOverlay({
  buildingTitle,
  facadeImage,
  facadeViewBox,
  units,
  selectedUnit,
  onSelectUnit,
  onUnitElementReady,
}: Props) {
  const [hoveredUnit, setHoveredUnit] = useState<Unit | null>(null);

  const imageUrl = facadeImage.asset?.url;

  if (!imageUrl) {
    return null;
  }

  return (
    <section>
      <div className="relative w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={buildingTitle}
          width={1600}
          height={900}
          sizes="(max-width: 768px) 100vw, 1200px"
          className="block h-auto w-full"
          priority
        />

        <SvgOverlay
          viewBox={facadeViewBox}
          units={units}
          selectedUnit={selectedUnit}
          onSelect={(unit) => {
            setHoveredUnit(null);
            onSelectUnit?.(unit);
          }}
          onUnitElementReady={onUnitElementReady}
        />

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
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-green-500/50" />
          <span>I lirë</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-amber-500/50" />
          <span>I rezervuar</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-gray-500/50" />
          <span>I shitur</span>
        </div>
      </div>
    </section>
  );
}