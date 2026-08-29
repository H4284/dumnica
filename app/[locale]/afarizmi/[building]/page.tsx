import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import BuildingExplorer from "@/components/afarizmi/BuildingExplorer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { type AppLocale } from "@/i18n/routing";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import {
  getBuildingBySlug,
  getUnitsByBuilding,
  getSiteSettings,
} from "@/sanity/lib/client";

type Props = {
  params: Promise<{
    locale: string;
    building: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { building, locale } = await params;
  setRequestLocale(locale as AppLocale);

  const [currentBuilding, t] = await Promise.all([
    getBuildingBySlug(building, locale),
    getTranslations("afarizmi"),
  ]);
  const href = `/afarizmi/${building}`;

  if (!currentBuilding) {
    return pageMetadata({
      locale,
      href,
      title: t("buildingAlt"),
      description: t("emptyBuildings"),
    });
  }

  const title = currentBuilding.title || t("buildingAlt");
  const description = currentBuilding.facadeImage?.asset?.url
    ? title
    : t("facadeMissing");

  return pageMetadata({
    locale,
    href,
    title,
    description,
    image: currentBuilding.facadeImage?.asset?.url,
  });
}

export default async function BuildingPage({ params }: Props) {
  const { building, locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("afarizmi");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const currentBuilding = await getBuildingBySlug(building, locale);

  if (!currentBuilding) {
    notFound();
  }

  const units = await getUnitsByBuilding(currentBuilding._id);
  const siteSettings = await getSiteSettings();
  const title = currentBuilding.title || t("buildingAlt");
  const href = `/afarizmi/${building}`;

  const crumbs = [
    { href: "/", label: tCommon("home") },
    { href: "/afarizmi", label: tNav("afarizmi") },
    { label: title },
  ];

  const jsonLd = breadcrumbJsonLd(locale, [
    { name: tCommon("home"), href: "/" },
    { name: tNav("afarizmi"), href: "/afarizmi" },
    { name: title, href },
  ]);

  if (!currentBuilding.facadeImage?.asset?.url) {
    return (
      <main>
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={crumbs} label={tCommon("breadcrumb")} />
        <h1>{currentBuilding.title}</h1>
        <p>{t("facadeMissing")}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <JsonLd data={jsonLd} />

      <Breadcrumbs items={crumbs} label={tCommon("breadcrumb")} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold">{currentBuilding.title}</h1>
      </header>

      <BuildingExplorer
        building={currentBuilding}
        units={units}
        whatsappNumber={siteSettings?.whatsapp ?? ""}
      />
    </main>
  );
}
