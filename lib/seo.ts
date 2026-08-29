import type { Metadata } from "next";

import { getPathname } from "@/i18n/navigation";
import { intlLocale, routing, type AppLocale } from "@/i18n/routing";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://dumnicagroup.com"
  ).replace(/\/$/, "");
}

export function localizedPath(locale: string, href: string) {
  return getPathname({
    locale: locale as AppLocale,
    href: href as Parameters<typeof getPathname>[0]["href"],
  });
}

export function absoluteUrl(locale: string, href: string) {
  return `${getSiteUrl()}${localizedPath(locale, href)}`;
}

export function pageAlternates(
  locale: string,
  href: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(routing.defaultLocale, href),
  };

  for (const item of routing.locales) {
    languages[item] = absoluteUrl(item, href);
  }

  return {
    canonical: absoluteUrl(locale, href),
    languages,
  };
}

export function hasUnitPrice(
  price: number | null | undefined,
): price is number {
  return typeof price === "number" && Number.isFinite(price);
}

export function formatEuroPrice(value: number, locale: string) {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ogLocale(locale: string) {
  switch (locale) {
    case "sq":
      return "sq_AL";
    case "de":
      return "de_DE";
    default:
      return "en_GB";
  }
}

export function breadcrumbJsonLd(
  locale: string,
  items: Array<{ name: string; href: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.href),
    })),
  };
}

export function pageMetadata({
  locale,
  href,
  title,
  description,
  image,
}: {
  locale: string;
  href: string;
  title: string;
  description: string;
  image?: string | null;
}): Metadata {
  const url = absoluteUrl(locale, href);

  return {
    title,
    description,
    alternates: pageAlternates(locale, href),
    openGraph: {
      title,
      description,
      url,
      locale: ogLocale(locale),
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: image
      ? {
          card: "summary_large_image",
          title,
          description,
          images: [image],
        }
      : {
          card: "summary",
          title,
          description,
        },
  };
}
