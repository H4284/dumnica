import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import BuildingPicker from "@/components/afarizmi/BuildingPicker";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { getAllBuildings, getHomePage } from "@/sanity/lib/client";

type AfarizmiPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: AfarizmiPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const [homePage, tNav] = await Promise.all([
    getHomePage(locale),
    getTranslations("nav"),
  ]);

  const title = tNav("afarizmi");

  return pageMetadata({
    locale,
    href: "/afarizmi",
    title,
    description: homePage?.afarizmiIntro || title,
  });
}

export default async function AfarizmiPage({ params }: AfarizmiPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const [homePage, buildings, tNav, tCommon] = await Promise.all([
    getHomePage(locale),
    getAllBuildings(locale),
    getTranslations("nav"),
    getTranslations("common"),
  ]);

  const title = tNav("afarizmi");

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tCommon("home"), href: "/" },
          { name: title, href: "/afarizmi" },
        ])}
      />

      <Breadcrumbs
        items={[
          { href: "/", label: tCommon("home") },
          { label: title },
        ]}
        label={tCommon("breadcrumb")}
      />

      <section>
        <h1>{title}</h1>

        {homePage?.afarizmiIntro && (
          <p>{homePage.afarizmiIntro}</p>
        )}

        <BuildingPicker buildings={buildings} />
      </section>
    </main>
  );
}
