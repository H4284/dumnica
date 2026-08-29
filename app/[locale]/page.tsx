import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Numbers from "@/components/home/Numbers";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import HashRedirect from "@/components/redirects/HashRedirect";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import {
  getAllProjects,
  getHomePage,
  getSiteSettings,
} from "@/sanity/lib/client";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const [homePage, t] = await Promise.all([
    getHomePage(locale),
    getTranslations("common"),
  ]);

  const title = homePage?.heroTitle || t("brand");
  const description = homePage?.aboutText || title;

  return pageMetadata({
    locale,
    href: "/",
    title,
    description,
    image: homePage?.heroImage?.asset?.url,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const [homePage, projects, siteSettings, t] = await Promise.all([
    getHomePage(locale),
    getAllProjects(locale),
    getSiteSettings(),
    getTranslations("common"),
  ]);

  if (!homePage || !siteSettings) {
    return null;
  }

  const siteUrl = absoluteUrl(locale, "/");
  const sameAs = [
    siteSettings.socialLinks?.instagram,
    siteSettings.socialLinks?.facebook,
    siteSettings.socialLinks?.linkedin,
  ].filter((value): value is string => Boolean(value));

  const address = siteSettings.address
    ? {
        "@type": "PostalAddress",
        streetAddress: siteSettings.address,
      }
    : undefined;

  const jsonLd = [
    {
      "@type": "Organization",
      name: t("brand"),
      url: siteUrl,
      ...(siteSettings.phone ? { telephone: siteSettings.phone } : {}),
      ...(siteSettings.email ? { email: siteSettings.email } : {}),
      ...(address ? { address } : {}),
      ...(sameAs.length > 0 ? { sameAs } : {}),
    },
    {
      "@type": "LocalBusiness",
      name: t("brand"),
      url: siteUrl,
      ...(siteSettings.phone ? { telephone: siteSettings.phone } : {}),
      ...(siteSettings.email ? { email: siteSettings.email } : {}),
      ...(address ? { address } : {}),
    },
  ];

  return (
    <main>
      <JsonLd data={jsonLd} />

      <Hero homePage={homePage} />

      <FeaturedProjects projects={projects} />

      <Numbers homePage={homePage} />

      <About homePage={homePage} />

      <Contact siteSettings={siteSettings} />

      <HashRedirect />
    </main>
  );
}
