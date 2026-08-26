"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { BuildingBySlugQueryResult, UnitsByBuildingQueryResult, } from "@/sanity.types";
import FloorSelector from "./FloorSelector";

type Building = NonNullable<BuildingBySlugQueryResult>;
type Unit = UnitsByBuildingQueryResult[number];

type Props = {
  building: Building;
  units: UnitsByBuildingQueryResult;
  visibleUnitIds?: Set<string>;
  onSelectUnit?: (unit: Unit) => void;
  selectedUnit?: Unit | null;
};

export default function FloorPlan({
  building,
  units,
  selectedUnit: _selectedUnit,
  onSelectUnit: _onSelectUnit,
  visibleUnitIds,
}: Props) {
  const [activeFloor, setActiveFloor] = useState(0);
  const [activePlanIndex, setActivePlanIndex] = useState(0);

  const floorUnits = useMemo(() => {
    return units.filter((unit) => unit.floor === activeFloor);
  }, [units, activeFloor]);

  const floorPlans = useMemo(() => {
    const seen = new Set<string>();
  
    return floorUnits
      .map((unit) => unit.floorPlanImage)
      .filter((image): image is NonNullable<Unit["floorPlanImage"]> => {
        const assetId = image?.asset?._id;
  
        if (!assetId || seen.has(assetId)) {
          return false;
        }
  
        seen.add(assetId);
        return true;
      });
  }, [floorUnits]);

  useEffect(() => {
    setActivePlanIndex(0);
  }, [activeFloor]);

  const activePlan = floorPlans[activePlanIndex];

  function handlePreviousPlan() {
    setActivePlanIndex((current) =>
      current === 0 ? floorPlans.length - 1 : current - 1,
    );
  }

  function handleNextPlan() {
    setActivePlanIndex((current) =>
      current === floorPlans.length - 1 ? 0 : current + 1,
    );
  }

  const floorLabel =
    activeFloor === 0 ? "Përdhesë" : `Kati ${activeFloor}`;

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Planimetria</h2>

        <p className="mt-1 text-sm text-gray-500">
          Zgjedh katin për të parë planimetritë.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[180px_1fr]">
        <FloorSelector
          floorsCount={building.floorsCount ?? 0}
          activeFloor={activeFloor}
          onFloorChange={setActiveFloor}
        />

        <div className="relative overflow-hidden rounded-lg bg-gray-50">
          {floorPlans.length > 0 && activePlan?.asset?.url ? (
            <div className="relative">
              <div className="relative overflow-hidden">
                <Image
                  src={activePlan.asset.url}
                  alt={`${building.title} - ${floorLabel} - Planimetria ${
                    activePlanIndex + 1
                  }`}
                  width={1600}
                  height={900}
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="block h-auto w-full select-none object-contain"
                  loading="lazy"
                  draggable={false}
                />
              </div>

              {floorPlans.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePreviousPlan}
                    aria-label="Planimetria paraprake"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-xl text-white transition hover:bg-black/90"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPlan}
                    aria-label="Planimetria tjetër"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-xl text-white transition hover:bg-black/90"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/60 px-3 py-2">
                    {floorPlans.map((plan, index) => (
                      <button
                        key={plan.asset?._id ?? index}
                        type="button"
                        onClick={() => setActivePlanIndex(index)}
                        aria-label={`Shfaq planimetrinë ${index + 1}`}
                        aria-current={
                          index === activePlanIndex ? "true" : undefined
                        }
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          index === activePlanIndex
                            ? "scale-110 bg-white"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">
                    {activePlanIndex + 1} / {floorPlans.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex min-h-80 items-center justify-center rounded-lg bg-gray-100">
              <p className="text-sm text-gray-500">
                Planimetria për {floorLabel.toLowerCase()} nuk është vendosur
                ende.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}