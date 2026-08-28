"use client";

import { useRef, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";

import type {
  BuildingBySlugQueryResult,
  UnitsByBuildingQueryResult,
} from "@/sanity.types";
import { formatFloorLabel } from "@/lib/i18nLabels";
import { unitStatusKey } from "@/lib/statusKeys";
import FacadeOverlay from "./FacadeOverlay";
import FloorPlan from "./FloorPlan";
import UnitFilters from "./UnitFilters";
import UnitPanel from "./UnitPanel";
import { filterUnits } from "./unitFilterUtils";

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
  const t = useTranslations("afarizmi");
  const tFloor = useTranslations("floor");
  const tStatus = useTranslations("unitStatus");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const selectedUnitElementRef = useRef<SVGPathElement | null>(null);

  const [
    {
      floor,
      rooms,
      minM2,
      maxM2,
      orientation,
      status,
      type,
      njesia,
    },
    setFilters,
  ] = useQueryStates({
    floor: parseAsInteger,
    rooms: parseAsInteger,
    minM2: parseAsInteger,
    maxM2: parseAsInteger,
    orientation: parseAsString,
    status: parseAsString.withDefault("i_lire"),
    type: parseAsString,
    njesia: parseAsString,
  });

  const filteredUnits = filterUnits(units, {
    floor,
    rooms,
    minM2,
    maxM2,
    orientation,
    status,
    type,
  });

  const urlSelectedUnit = njesia
    ? units.find((unit) => unit.code === njesia) ?? null
    : null;

  const visibleSelectedUnit = selectedUnit ?? urlSelectedUnit ?? null;

  const visibleUnitIds = new Set(
    filteredUnits.map((unit) => unit._id),
  );

  function handleSelectUnit(unit: Unit) {
    if (unit.status === "i_shitur") {
      return;
    }

    setSelectedUnit(unit);

    void setFilters({
      njesia: unit.code,
    });

    requestAnimationFrame(() => {
      selectedUnitElementRef.current?.focus();
    });
  }

  function handleUnitElementReady(
    unitId: string,
    element: SVGPathElement,
  ) {
    if (visibleSelectedUnit?._id === unitId) {
      selectedUnitElementRef.current = element;
    }
  }

  function handleClosePanel() {
    setSelectedUnit(null);

    void setFilters({
      njesia: null,
    });
  }

  return (
    <>
      <UnitFilters floorsCount={building.floorsCount ?? 0} />

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {t("matchingUnits", { count: filteredUnits.length })}
        </p>
      </div>

      {building.facadeImage?.asset?.url && (
        <FacadeOverlay
          buildingTitle={building.title ?? t("buildingAlt")}
          facadeImage={building.facadeImage}
          facadeViewBox={building.facadeViewBox ?? "0 0 1600 900"}
          units={units}
          visibleUnitIds={visibleUnitIds}
          selectedUnit={visibleSelectedUnit}
          onSelectUnit={handleSelectUnit}
          onUnitElementReady={handleUnitElementReady}
        />
      )}

      <FloorPlan
        building={building}
        units={units}
        selectedUnit={visibleSelectedUnit}
        onSelectUnit={handleSelectUnit}
        visibleUnitIds={visibleUnitIds}
      />

      <div className="sr-only">
        <table>
          <caption>
            {t("unitsTable", {
              building: building.title ?? t("objectFallback"),
            })}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t("unit")}</th>
              <th scope="col">{t("floor")}</th>
              <th scope="col">{t("rooms")}</th>
              <th scope="col">{t("area")}</th>
              <th scope="col">{t("status")}</th>
            </tr>
          </thead>

          <tbody>
            {filteredUnits.map((unit) => (
              <tr key={unit._id}>
                <td>
                  <button
                    type="button"
                    onClick={() => handleSelectUnit(unit)}
                    disabled={unit.status === "i_shitur"}
                  >
                    {unit.code ?? t("noCode")}
                  </button>
                </td>

                <td>
                  {formatFloorLabel(unit.floor, {
                    ground: tFloor("ground"),
                    n: (n) => tFloor("n", { n }),
                  })}
                </td>

                <td>{unit.rooms ?? "—"}</td>

                <td>
                  {unit.areaNet !== null && unit.areaNet !== undefined
                    ? `${unit.areaNet} m²`
                    : "—"}
                </td>

                <td>{tStatus(unitStatusKey(unit.status))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UnitPanel
        unit={visibleSelectedUnit}
        onClose={handleClosePanel}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
