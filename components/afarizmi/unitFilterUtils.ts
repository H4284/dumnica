import type { UnitsByBuildingQueryResult } from "@/sanity.types";

type Unit = UnitsByBuildingQueryResult[number];

export type UnitFilterValues = {
  floor: number | null;
  rooms: number | null;
  minM2: number | null;
  maxM2: number | null;
  orientation: string | null;
  status: string;
  type: string | null;
};

export function filterUnits(
  units: UnitsByBuildingQueryResult,
  filters: UnitFilterValues,
) {
  return units.filter((unit) => {
    if (filters.floor !== null && unit.floor !== filters.floor) {
      return false;
    }

    if (filters.rooms !== null) {
      if (filters.rooms >= 5) {
        if ((unit.rooms ?? 0) < 5) {
          return false;
        }
      } else if (unit.rooms !== filters.rooms) {
        return false;
      }
    }

    if (
      filters.minM2 !== null &&
      (unit.areaNet === null || unit.areaNet < filters.minM2)
    ) {
      return false;
    }

    if (
      filters.maxM2 !== null &&
      (unit.areaNet === null || unit.areaNet > filters.maxM2)
    ) {
      return false;
    }

    if (
      filters.orientation &&
      !(unit.orientation ?? []).includes(filters.orientation)
    ) {
      return false;
    }

    if (filters.status && unit.status !== filters.status) {
      return false;
    }

    if (filters.type && unit.unitType !== filters.type) {
      return false;
    }

    return true;
  });
}