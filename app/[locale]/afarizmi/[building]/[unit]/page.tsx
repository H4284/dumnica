import type { Metadata } from "next";
import type { AllUnitsQueryResult } from "@/sanity.types";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
    getAllUnits,
    getUnitByBuildingAndCode,
  } from "@/sanity/lib/client";

type Props = {
  params: Promise<{
    locale: string;
    building: string;
    unit: string;
  }>;
};

export async function generateStaticParams() {
    const units = await getAllUnits();
  
    const locales = ["sq", "en"];
  
  return locales.flatMap((locale) =>
  units
    .filter((unit: AllUnitsQueryResult[number]) => unit.code && unit.buildingSlug)
    .map((unit: AllUnitsQueryResult[number]) => ({
      locale,
      building: unit.buildingSlug!,
      unit: unit.code!,
    })),
);
  }

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { building, unit } = await params;

  const currentUnit = await getUnitByBuildingAndCode(building, unit);

  if (!currentUnit) {
    return {
      title: "Njësia nuk u gjet | Dumnica Group",
    };
  }

  const buildingTitle = currentUnit.building?.title ?? "Dumnica Group";
  const unitCode = currentUnit.code ?? unit;

  const roomsText = currentUnit.rooms
    ? `${currentUnit.rooms} dhomëshe`
    : "Banesë";

  const areaText = currentUnit.areaNet
    ? `${currentUnit.areaNet}m²`
    : "";

  const floorText =
    currentUnit.floor === 0
      ? "Përdhesë"
      : currentUnit.floor
        ? `Kati ${currentUnit.floor}`
        : "";

  const title = `${roomsText}, ${areaText} — ${buildingTitle}, ${floorText} | Dumnica Group`;

  const description = [
    currentUnit.rooms ? `${currentUnit.rooms} dhoma` : null,
    currentUnit.areaNet ? `${currentUnit.areaNet}m² sipërfaqe neto` : null,
    floorText,
    currentUnit.orientation?.length
      ? `Orientim: ${currentUnit.orientation.join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description: description || `Njësia ${unitCode} në ${buildingTitle}.`,
  };
}

type UnitStatus = "i_lire" | "i_rezervuar" | "i_shitur" | null;

function getStatusLabel(status: UnitStatus) {
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

export default async function UnitPage({ params }: Props) {
  const { locale, building, unit } = await params;

  const currentUnit = await getUnitByBuildingAndCode(building, unit);

  if (!currentUnit) {
    notFound();
  }

  const buildingTitle = currentUnit.building?.title ?? "Dumnica Group";
  const unitCode = currentUnit.code ?? unit;

  const floorLabel =
    currentUnit.floor === 0
      ? "Përdhesë"
      : currentUnit.floor !== null
        ? `Kati ${currentUnit.floor}`
        : "—";

  const statusLabel = getStatusLabel(currentUnit.status);

  const availability =
    currentUnit.status === "i_shitur"
      ? "https://schema.org/SoldOut"
      : currentUnit.status === "i_rezervuar"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock";

  const interactiveUrl = `/${locale}/afarizmi/${building}?njesia=${encodeURIComponent(
    unitCode,
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: `${buildingTitle} — ${unitCode}`,
    identifier: unitCode,
    numberOfRooms: currentUnit.rooms ?? undefined,
    floorSize: currentUnit.areaNet
      ? {
          "@type": "QuantitativeValue",
          value: currentUnit.areaNet,
          unitCode: "MTK",
        }
      : undefined,
    floor:
      currentUnit.floor !== null
        ? String(currentUnit.floor)
        : undefined,
    offers: {
      "@type": "Offer",
      availability,
      ...(currentUnit.price !== null
        ? {
            price: currentUnit.price,
            priceCurrency: "EUR",
          }
        : {}),
    },
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <header className="mb-10 text-primary">
        <p className="mb-2 text-sm text-secondary">
          {buildingTitle}
        </p>

        <h1 className="text-3xl font-bold text-primary">
          Njësia {unitCode}
        </h1>

        <p className="mt-2 text-primary">
          {statusLabel}
        </p>
      </header>

      <section className="grid gap-6 rounded-xl border border-border bg-surface p-6 text-primary sm:grid-cols-2">
        <div>
          <h2 className="text-sm text-secondary">Dhoma</h2>
          <p className="text-xl font-semibold text-primary">
            {currentUnit.rooms ?? "—"}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">Sipërfaqe neto</h2>
          <p className="text-xl font-semibold text-primary">
            {currentUnit.areaNet
              ? `${currentUnit.areaNet} m²`
              : "—"}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">Sipërfaqe bruto</h2>
          <p className="text-xl font-semibold text-primary">
            {currentUnit.areaGross
              ? `${currentUnit.areaGross} m²`
              : "—"}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">Kati</h2>
          <p className="text-xl font-semibold text-primary">{floorLabel}</p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">Orientimi</h2>
          <p className="text-xl font-semibold text-primary">
            {currentUnit.orientation?.length
              ? currentUnit.orientation.join(", ")
              : "—"}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">Tipi</h2>
          <p className="text-xl font-semibold text-primary">
            {currentUnit.unitType === "banesor"
              ? "Banesor"
              : currentUnit.unitType === "afarist"
                ? "Afarist"
                : "—"}
          </p>
        </div>
      </section>

      {currentUnit.floorPlanImage?.asset?.url && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Planimetria
          </h2>

          <img
            src={currentUnit.floorPlanImage.asset.url}
            alt={`Planimetria e njësisë ${unitCode}`}
            className="w-full rounded-lg"
          />
        </section>
      )}

      {currentUnit.floorPlanPdf?.asset?.url && (
        <section className="mt-8">
          <a
            href={currentUnit.floorPlanPdf.asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg border px-5 py-3 font-medium"
          >
            Shiko planimetrinë PDF
          </a>
        </section>
      )}

      <section className="mt-10">
        {currentUnit.status === "i_shitur" ? (
          <div className="rounded-lg border p-5">
            <h2 className="font-semibold">
              Kjo njësi është shitur
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Shiko njësitë e tjera të disponueshme.
            </p>

            <Link
              href={`/${locale}/afarizmi/${building}`}
              className="mt-4 inline-flex rounded-lg bg-black px-5 py-3 text-white"
            >
              Shiko njësi të ngjashme
            </Link>
          </div>
        ) : (
          <Link
            href={interactiveUrl}
            className="inline-flex rounded-lg bg-black px-5 py-3 text-white"
          >
            Shiko në eksploruesin interaktiv
          </Link>
        )}
      </section>
    </main>
  );
}