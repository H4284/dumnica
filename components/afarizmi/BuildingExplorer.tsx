"use client";

import { useRef, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates, } from "nuqs";
import type { BuildingBySlugQueryResult, UnitsByBuildingQueryResult, } from "@/sanity.types";
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

export default function BuildingExplorer({
  building,
  units,
  whatsappNumber,
}: Props) {
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

  /*
   * Filter the units according to the URL query parameters.
   */
  const filteredUnits = filterUnits(units, {
    floor,
    rooms,
    minM2,
    maxM2,
    orientation,
    status,
    type,
  });

  /*
   * If the URL contains ?njesia=A-3-14,
   * find that exact unit.
   */
  const urlSelectedUnit = njesia
    ? units.find((unit) => unit.code === njesia) ?? null
    : null;

  /*
   * The unit that should currently be selected.
   *
   * Local state is used after clicking a unit.
   * URL state is used after refresh / opening a shared link.
   */
  const visibleSelectedUnit =
    selectedUnit ?? urlSelectedUnit ?? null;

  /*
   * IDs of units that match the current filters.
   *
   * FacadeOverlay uses this to dim units that don't match.
   */
  const visibleUnitIds = new Set(
    filteredUnits.map((unit) => unit._id),
  );

  function handleSelectUnit(unit: Unit) {
    if (unit.status === "i_shitur") {
      return;
    }

    setSelectedUnit(unit);

    /*
     * Put the selected apartment in the URL.
     * Example:
     * ?status=i_lire&njesia=A-3-14
     */
    void setFilters({
      njesia: unit.code,
    });

    /*
     * Focus the SVG element after it has been selected.
     */
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

    /*
     * Remove the apartment from the URL,
     * but keep the other filters.
     */
    void setFilters({
      njesia: null,
    });
  }

  return (
    <>
      <UnitFilters
        floorsCount={building.floorsCount ?? 0}
      />

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <strong>{filteredUnits.length}</strong>{" "}
          {filteredUnits.length === 1
            ? "njësi përputhet"
            : "njësi përputhen"}
        </p>
      </div>

      {building.facadeImage?.asset?.url && (
        <FacadeOverlay
          buildingTitle={building.title ?? "Building"}
          facadeImage={building.facadeImage}
          facadeViewBox={
            building.facadeViewBox ?? "0 0 1600 900"
          }
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
    <caption>Lista e njësive në {building.title ?? "objektin"}</caption>
    <thead>
      <tr>
        <th scope="col">Njësia</th>
        <th scope="col">Kati</th>
        <th scope="col">Dhoma</th>
        <th scope="col">Sipërfaqja</th>
        <th scope="col">Statusi</th>
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
              {unit.code ?? "Pa kod"}
            </button>
          </td>

          <td>
            {unit.floor === 0
              ? "Përdhesë"
              : unit.floor !== null
                ? `Kati ${unit.floor}`
                : "—"}
          </td>

          <td>{unit.rooms ?? "—"}</td>

          <td>
            {unit.areaNet !== null && unit.areaNet !== undefined
              ? `${unit.areaNet} m²`
              : "—"}
          </td>

          <td>{getStatusLabel(unit.status)}</td>
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