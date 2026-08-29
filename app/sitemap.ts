import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import {
  getAllBuildings,
  getAllPageSlugs,
  getAllProjects,
  getAllUnits,
} from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, buildings, units, pages] = await Promise.all([
    getAllProjects(),
    getAllBuildings(),
    getAllUnits(),
    getAllPageSlugs(),
  ]);

  const hrefs = new Set<string>(["/", "/projects", "/afarizmi"]);

  for (const project of projects) {
    if (project.slug?.current) {
      hrefs.add(`/projects/${project.slug.current}`);
    }
  }

  for (const building of buildings) {
    if (building.slug) {
      hrefs.add(`/afarizmi/${building.slug}`);
    }
  }

  for (const unit of units) {
    if (unit.code && unit.buildingSlug) {
      hrefs.add(`/afarizmi/${unit.buildingSlug}/${unit.code}`);
    }
  }

  for (const page of pages) {
    if (page.slug) {
      hrefs.add(`/${page.slug}`);
    }
  }

  return [...hrefs].flatMap((href) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      changeFrequency: href.includes("/afarizmi/") ? "daily" as const : "weekly" as const,
      priority: href === "/" ? 1 : 0.8,
    })),
  );
}
