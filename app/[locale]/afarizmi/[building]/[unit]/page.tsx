import type { Metadata } from "next";
import type { AllUnitsQueryResult } from "@/sanity.types";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { formatFloorLabel, formatOrientation } from "@/lib/i18nLabels";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  formatEuroPrice,
  hasUnitPrice,
  pageMetadata,
} from "@/lib/seo";
import { unitStatusKey } from "@/lib/statusKeys";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
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

  return routing.locales.flatMap((locale) =>
    units
      .filter(
        (unit: AllUnitsQueryResult[number]) =>
          unit.code && unit.buildingSlug,
      )
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
  const { building, unit, locale } = await params;
  setRequestLocale(locale as AppLocale);

  const [currentUnit, t, tAfarizmi, tFloor, tStatus] = await Promise.all([
    getUnitByBuildingAndCode(building, unit, locale),
    getTranslations("unit"),
    getTranslations("afarizmi"),
    getTranslations("floor"),
    getTranslations("unitStatus"),
  ]);

  const href = `/afarizmi/${building}/${unit}`;

  if (!currentUnit) {
    return pageMetadata({
      locale,
      href,
      title: t("codeTitle", { code: unit }),
      description: t("codeTitle", { code: unit }),
    });
  }

  const unitCode = currentUnit.code ?? unit;
  const title = t("codeTitle", { code: unitCode });
  const floorLabel = formatFloorLabel(currentUnit.floor, {
    ground: tFloor("ground"),
    n: (n) => tFloor("n", { n }),
  });
  const priceLabel = hasUnitPrice(currentUnit.price)
    ? formatEuroPrice(currentUnit.price, locale)
    : t("priceOnRequest");

  const description = [
    currentUnit.building?.title,
    currentUnit.rooms != null
      ? tAfarizmi("roomsShort", { count: currentUnit.rooms })
      : null,
    currentUnit.areaNet ? `${currentUnit.areaNet} m²` : null,
    floorLabel,
    tStatus(unitStatusKey(currentUnit.status)),
    `${t("price")}: ${priceLabel}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return pageMetadata({
    locale,
    href,
    title,
    description,
    image: currentUnit.floorPlanImage?.asset?.url,
  });
}

export default async function UnitPage({ params }: Props) {
  const { building, unit, locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("unit");
  const tAfarizmi = await getTranslations("afarizmi");
  const tNav = await getTranslations("nav");
  const tFloor = await getTranslations("floor");
  const tFilters = await getTranslations("filters");
  const tStatus = await getTranslations("unitStatus");
  const tCommon = await getTranslations("common");

  const currentUnit = await getUnitByBuildingAndCode(building, unit, locale);

  if (!currentUnit) {
    notFound();
  }

  const buildingTitle =
    currentUnit.building?.title ||
    currentUnit.building?.slug ||
    building;
  const unitCode = currentUnit.code ?? unit;
  const href = `/afarizmi/${building}/${unitCode}`;
  const buildingHref = `/afarizmi/${building}`;

  const floorLabel = formatFloorLabel(currentUnit.floor, {
    ground: tFloor("ground"),
    n: (n) => tFloor("n", { n }),
  });
  const statusLabel = tStatus(unitStatusKey(currentUnit.status));
  const priceLabel = hasUnitPrice(currentUnit.price)
    ? formatEuroPrice(currentUnit.price, locale)
    : t("priceOnRequest");

  const availability =
    currentUnit.status === "i_shitur"
      ? "https://schema.org/SoldOut"
      : currentUnit.status === "i_rezervuar"
        ? "https://schema.org/LimitedAvailability"
        : currentUnit.status === "i_lire"
          ? "https://schema.org/InStock"
          : undefined;

  const interactiveUrl = `/afarizmi/${building}?njesia=${encodeURIComponent(
    unitCode,
  )}`;

  const offer = {
    "@type": "Offer",
    url: absoluteUrl(locale, href),
    ...(availability ? { availability } : {}),
    ...(hasUnitPrice(currentUnit.price)
      ? {
          price: currentUnit.price,
          priceCurrency: "EUR",
        }
      : {}),
  };

  const jsonLd = [
    {
      "@type": "Accommodation",
      name: `${buildingTitle} — ${unitCode}`,
      identifier: unitCode,
      url: absoluteUrl(locale, href),
      numberOfRooms: currentUnit.rooms ?? undefined,
      floorSize: currentUnit.areaNet
        ? {
            "@type": "QuantitativeValue",
            value: currentUnit.areaNet,
            unitCode: "MTK",
          }
        : undefined,
      floor:
        currentUnit.floor !== null ? String(currentUnit.floor) : undefined,
      offers: offer,
    },
    breadcrumbJsonLd(locale, [
      { name: tCommon("home"), href: "/" },
      { name: tNav("afarizmi"), href: "/afarizmi" },
      { name: buildingTitle, href: buildingHref },
      { name: unitCode, href },
    ]),
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <JsonLd data={jsonLd} />

      <Breadcrumbs
        items={[
          { href: "/", label: tCommon("home") },
          { href: "/afarizmi", label: tNav("afarizmi") },
          { href: buildingHref, label: buildingTitle },
          { label: unitCode },
        ]}
        label={tCommon("breadcrumb")}
      />

      <header className="mb-10 text-primary">
        <p className="mb-2 text-sm text-secondary">
          {buildingTitle}
        </p>

        <h1 className="text-3xl font-bold text-primary">
          {t("codeTitle", { code: unitCode })}
        </h1>

        <p className="mt-2 text-primary">
          {statusLabel}
        </p>
      </header>

      <section className="grid gap-6 rounded-xl border border-border bg-surface p-6 text-primary sm:grid-cols-2">
        <div>
          <h2 className="text-sm text-secondary">{tAfarizmi("rooms")}</h2>
          <p className="text-xl font-semibold text-primary">
            {currentUnit.rooms ?? "—"}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">{t("netArea")}</h2>
          <p className="text-xl font-semibold text-primary">
            {currentUnit.areaNet
              ? `${currentUnit.areaNet} m²`
              : "—"}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">{t("grossArea")}</h2>
          <p className="text-xl font-semibold text-primary">
            {currentUnit.areaGross
              ? `${currentUnit.areaGross} m²`
              : "—"}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">{tAfarizmi("floor")}</h2>
          <p className="text-xl font-semibold text-primary">{floorLabel}</p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">{t("orientation")}</h2>
          <p className="text-xl font-semibold text-primary">
            {formatOrientation(currentUnit.orientation, {
              east: tFilters("east"),
              west: tFilters("west"),
              north: tFilters("north"),
              south: tFilters("south"),
            })}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">{t("type")}</h2>
          <p className="text-xl font-semibold text-primary">
            {currentUnit.unitType === "banesor"
              ? t("residential")
              : currentUnit.unitType === "afarist"
                ? t("commercial")
                : "—"}
          </p>
        </div>

        <div>
          <h2 className="text-sm text-secondary">{t("price")}</h2>
          <p className="text-xl font-semibold text-primary">{priceLabel}</p>
        </div>
      </section>

      {currentUnit.floorPlanImage?.asset?.url && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("plan")}
          </h2>

          <img
            src={currentUnit.floorPlanImage.asset.url}
            alt={t("planAlt", { code: unitCode })}
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
            {t("viewPdf")}
          </a>
        </section>
      )}

      <section className="mt-10">
        {currentUnit.status === "i_shitur" ? (
          <div className="rounded-lg border p-5">
            <h2 className="font-semibold">{t("soldTitle")}</h2>

            <p className="mt-1 text-sm text-gray-600">{t("soldHint")}</p>

            <Link
              href={`/afarizmi/${building}`}
              className="mt-4 inline-flex rounded-lg bg-black px-5 py-3 text-white"
            >
              {t("similarUnits")}
            </Link>
          </div>
        ) : (
          <Link
            href={interactiveUrl}
            className="inline-flex rounded-lg bg-black px-5 py-3 text-white"
          >
            {t("openExplorer")}
          </Link>
        )}
      </section>
    </main>
  );
}
