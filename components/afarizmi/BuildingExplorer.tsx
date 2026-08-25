"use client";

import { useRef, useState } from "react";

import type {
  BuildingBySlugQueryResult,
  UnitsByBuildingQueryResult,
} from "@/sanity.types";

import FacadeOverlay from "./FacadeOverlay";
import FloorPlan from "./FloorPlan";
import UnitPanel from "./UnitPanel";

type Building = NonNullable<BuildingBySlugQueryResult>;
type Unit = UnitsByBuildingQueryResult[number];

type Props = {
  building: Building;
  units: UnitsByBuildingQueryResult;
  whatsappNumber: string;
};

export default function BuildingExplorer({
  building,
  units,
  whatsappNumber,
}: Props) {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const selectedUnitElementRef = useRef<SVGPathElement | null>(null);

  function handleSelectUnit(unit: Unit) {
    setSelectedUnit(unit);
  }

  function handleUnitElementReady(
    unitId: string,
    element: SVGPathElement,
  ) {
    if (selectedUnit?._id === unitId) {
      selectedUnitElementRef.current = element;
    }
  }

  function handleClosePanel() {
    setSelectedUnit(null);

    requestAnimationFrame(() => {
      selectedUnitElementRef.current?.focus();
    });
  }

  return (
    <>
      {building.facadeImage?.asset?.url && (
        <FacadeOverlay
          buildingTitle={building.title ?? "Building"}
          facadeImage={building.facadeImage}
          facadeViewBox={building.facadeViewBox ?? "0 0 1600 900"}
          units={units}
          selectedUnit={selectedUnit}
          onSelectUnit={handleSelectUnit}
          onUnitElementReady={handleUnitElementReady}
        />
      )}

      <FloorPlan
        building={building}
        units={units}
        selectedUnit={selectedUnit}
        onSelectUnit={handleSelectUnit}
      />

      <UnitPanel
        unit={selectedUnit}
        onClose={handleClosePanel}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}