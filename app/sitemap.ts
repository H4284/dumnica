import type { MetadataRoute } from "next";

import { getAllUnits } from "@/sanity/lib/client";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dumnicagroup.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const units = await getAllUnits();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/sq`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      changeFrequency: "weekly",
      priority: 1,
    },
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
    {
      url: `${baseUrl}/sq/projects`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/projects`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const unitUrls: MetadataRoute.Sitemap = units
    .filter((unit) => unit.code && unit.buildingSlug)
    .flatMap((unit) =>
      ["sq", "en"].map((locale) => ({
        url: `${baseUrl}/${locale}/afarizmi/${unit.buildingSlug}/${encodeURIComponent(
          unit.code!
        )}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      }))
    );

  return [...staticUrls, ...unitUrls];
}