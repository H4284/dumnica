import type { MetadataRoute } from "next";

import { getAllUnits } from "@/sanity/lib/client";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dumnicagroup.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const units = await getAllUnits();

  const unitUrls = units
    .filter((unit) => unit.code && unit.buildingSlug)
    .flatMap((unit) =>
      ["sq", "en"].map((locale) => ({
        url: `${baseUrl}/${locale}/afarizmi/${unit.buildingSlug}/${encodeURIComponent(unit.code!)}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    );

  return [
    {
      url: `${baseUrl}/sq/afarizmi`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/afarizmi`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...unitUrls,
  ];
}