import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { routing, type AppLocale } from "@/i18n/routing";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getAllPageSlugs, getPageBySlug } from "@/sanity/lib/client";

type LegalPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const pages = await getAllPageSlugs();

  return pages
    .filter((page) => page.slug)
    .flatMap((page) =>
      routing.locales.map((locale) => ({
        locale,
        slug: page.slug,
      })),
    );
}

export async function generateMetadata({
  params,
}: LegalPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale as AppLocale);

  const page = await getPageBySlug(slug, locale);
  const href = `/${slug}`;

  if (!page) {
    const t = await getTranslations("notFound");
    return pageMetadata({
      locale,
      href,
      title: t("heading"),
      description: t("body"),
    });
  }

  const title = page.seoTitle || page.title || slug;
  const description = page.seoDescription || title;

  return pageMetadata({
    locale,
    href,
    title,
    description,
    image: page.seoImage?.asset?.url,
  });
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale as AppLocale);

  const page = await getPageBySlug(slug, locale);

  if (!page) {
    notFound();
  }

  const tCommon = await getTranslations("common");
  const title = page.title || slug;
  const href = `/${slug}`;

  return (
    <article className="page-shell">
      <div className="site-container pb-20">
        <JsonLd
          data={breadcrumbJsonLd(locale, [
            { name: tCommon("home"), href: "/" },
            { name: title, href },
          ])}
        />

        <Breadcrumbs
          items={[
            { href: "/", label: tCommon("home") },
            { label: title },
          ]}
          label={tCommon("breadcrumb")}
        />

        <h1 className="page-title mb-8">{page.title}</h1>

        {page.body && (
          <div className="legal-prose">
            <PortableText value={page.body} />
          </div>
        )}
      </div>
    </article>
  );
}
