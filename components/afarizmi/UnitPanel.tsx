"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useState } from "react";
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
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

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
    unit.floor === 0 ? "Përdhesë" : `Kati ${unit.floor}`;

  const whatsappMessage = encodeURIComponent(
    `Përshëndetje, jam i interesuar për njësinë ${unit.code}`,
  );

  const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, "");

const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`;

  const floorPlanUrl = unit.floorPlanImage?.asset?.url;
  const floorPlanPdfUrl = unit.floorPlanPdf?.asset?.url;
  console.log("PDF URL:", unit.code, floorPlanPdfUrl);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        aria-hidden="true"
        onClick={() => {
          setShowLeadForm(false);
          onClose();
        }}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unit-panel-title"
        className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[440px] lg:max-h-none lg:rounded-none lg:rounded-l-2xl"
      >
        <div className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">{floorLabel}</p>

              <h2
                id="unit-panel-title"
                className="mt-1 text-2xl font-bold"
              >
                {unit.code}
              </h2>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Mbyll"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-700 transition hover:bg-gray-200"
            >
              ×
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Dhoma</p>
              <p className="mt-1 font-semibold">
                {unit.rooms ?? "-"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Neto</p>
              <p className="mt-1 font-semibold">
                {unit.areaNet ?? "-"} m²
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Bruto</p>
              <p className="mt-1 font-semibold">
                {unit.areaGross ?? "-"} m²
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Orientimi</p>
              <p className="mt-1 font-semibold">
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
              <p className="mb-2 text-sm font-medium text-gray-700">
                Planimetria
              </p>

              <button
                type="button"
                className="group relative block w-full overflow-hidden rounded-lg bg-gray-100"
                onClick={() => {
                  window.open(floorPlanUrl, "_blank");
                }}
              >
                <Image
                  src={floorPlanUrl}
                  alt={`Planimetria ${unit.code}`}
                  width={800}
                  height={600}
                  sizes="440px"
                  className="h-auto w-full transition-transform group-hover:scale-[1.02]"
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
      className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
    >
      Interesohem
    </button>

    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="block w-full rounded-lg bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
    >
      WhatsApp
    </a>

    {floorPlanPdfUrl && (
      <a
      href={floorPlanPdfUrl}
      download
      className="block w-full rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
    >
      Shkarko planin
    </a>
    )}
  </div>
)}
        </div>
      </aside>
    </>
  );
}