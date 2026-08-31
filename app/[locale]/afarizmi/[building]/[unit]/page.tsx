import type { Metadata } from "next";
import type { AllUnitsQueryResult } from "@/sanity.types";
import Image from "next/image";
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
import PageEvent from "@/components/analytics/PageEvent";
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
    <div className="page-shell">
      <div className="site-container pb-20">
        <PageEvent event="unit_view" />
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

        <header className="mb-10 pt-4">
          <p className="section-kicker">{buildingTitle}</p>
          <h1 className="page-title">
            {t("codeTitle", { code: unitCode })}
          </h1>
          <p className="mt-3 text-secondary">{statusLabel}</p>
        </header>

        <section className="spec-grid surface-card">
          <div>
            <p className="text-sm text-secondary">{tAfarizmi("rooms")}</p>
            <p className="mt-1 font-display text-2xl">
              {currentUnit.rooms ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary">{t("netArea")}</p>
            <p className="mt-1 font-display text-2xl">
              {currentUnit.areaNet
                ? `${currentUnit.areaNet} m²`
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary">{t("grossArea")}</p>
            <p className="mt-1 font-display text-2xl">
              {currentUnit.areaGross
                ? `${currentUnit.areaGross} m²`
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary">{tAfarizmi("floor")}</p>
            <p className="mt-1 font-display text-2xl">{floorLabel}</p>
          </div>

          <div>
            <p className="text-sm text-secondary">{t("orientation")}</p>
            <p className="mt-1 font-display text-2xl">
              {formatOrientation(currentUnit.orientation, {
                east: tFilters("east"),
                west: tFilters("west"),
                north: tFilters("north"),
                south: tFilters("south"),
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary">{t("type")}</p>
            <p className="mt-1 font-display text-2xl">
              {currentUnit.unitType === "banesor"
                ? t("residential")
                : currentUnit.unitType === "afarist"
                  ? t("commercial")
                  : "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary">{t("price")}</p>
            <p className="mt-1 font-display text-2xl">{priceLabel}</p>
          </div>
        </section>

        {currentUnit.floorPlanImage?.asset?.url && (
          <section className="detail-section">
            <h2>{t("plan")}</h2>

            <Image
              src={currentUnit.floorPlanImage.asset.url}
              alt={t("planAlt", { code: unitCode })}
              width={
                currentUnit.floorPlanImage.asset.metadata?.dimensions?.width ??
                1600
              }
              height={
                currentUnit.floorPlanImage.asset.metadata?.dimensions?.height ??
                2263
              }
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-auto w-full rounded-sm"
            />
          </section>
        )}

        {currentUnit.floorPlanPdf?.asset?.url && (
          <section className="mt-4">
            <a
              href={currentUnit.floorPlanPdf.asset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              {t("viewPdf")}
            </a>
          </section>
        )}

        <section className="detail-section">
          {currentUnit.status === "i_shitur" ? (
            <div className="surface-card">
              <h2 className="font-display text-2xl">{t("soldTitle")}</h2>

              <p className="mt-2 text-sm text-secondary">{t("soldHint")}</p>

              <Link
                href={`/afarizmi/${building}`}
                className="btn btn-primary mt-6"
              >
                {t("similarUnits")}
              </Link>
            </div>
          ) : (
            <Link href={interactiveUrl} className="btn btn-primary">
              {t("openExplorer")}
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
