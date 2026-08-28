import { createClient } from "next-sanity";
import type {
  AllProjectsQueryResult,
  HomePageQueryResult,
  PageBySlugQueryResult,
  ProjectBySlugQueryResult,
  SiteSettingsQueryResult,
  AllBuildingsQueryResult,
  BuildingBySlugQueryResult,
  UnitsByBuildingQueryResult,
  UnitByBuildingAndCodeQueryResult,
  AllUnitsQueryResult,
} from "../../sanity.types";
import { routing } from "@/i18n/routing";
import {
  allProjectsQuery,
  pageBySlugQuery,
  projectBySlugQuery,
  siteSettingsQuery,
  homePageQuery,
  allBuildingsQuery,
  buildingBySlugQuery,
  unitsByBuildingQuery,
  unitByBuildingAndCodeQuery,
  allUnitsQuery,
} from "./queries";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-08-18",
  useCdn: true,
});

function resolveLocale(locale?: string): string {
  return routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale!
    : routing.defaultLocale;
}

export async function getAllProjects(
  locale?: string,
): Promise<AllProjectsQueryResult> {
  return client.fetch(allProjectsQuery, { locale: resolveLocale(locale) });
}

export async function getProjectBySlug(
  slug: string,
  locale?: string,
): Promise<ProjectBySlugQueryResult> {
  return client.fetch(projectBySlugQuery, {
    slug,
    locale: resolveLocale(locale),
  });
}

export async function getSiteSettings(): Promise<SiteSettingsQueryResult> {
  return client.fetch(siteSettingsQuery);
}

export async function getPageBySlug(
  slug: string,
  locale?: string,
): Promise<PageBySlugQueryResult> {
  return client.fetch(pageBySlugQuery, {
    slug,
    locale: resolveLocale(locale),
  });
}

export async function getHomePage(
  locale?: string,
): Promise<HomePageQueryResult> {
  return client.fetch(homePageQuery, { locale: resolveLocale(locale) });
}

export async function getAllBuildings(
  locale?: string,
): Promise<AllBuildingsQueryResult> {
  return client.fetch(allBuildingsQuery, { locale: resolveLocale(locale) });
}

export async function getBuildingBySlug(
  slug: string,
  locale?: string,
): Promise<BuildingBySlugQueryResult> {
  return client.fetch(buildingBySlugQuery, {
    slug,
    locale: resolveLocale(locale),
  });
}

export async function getUnitsByBuilding(
  buildingId: string,
): Promise<UnitsByBuildingQueryResult> {
  return client.fetch(unitsByBuildingQuery, { buildingId });
}

export async function getUnitByBuildingAndCode(
  buildingSlug: string,
  unitCode: string,
  locale?: string,
): Promise<UnitByBuildingAndCodeQueryResult> {
  return client.fetch(unitByBuildingAndCodeQuery, {
    buildingSlug,
    unitCode,
    locale: resolveLocale(locale),
  });
}

export async function getAllUnits(): Promise<AllUnitsQueryResult> {
  return client.fetch(allUnitsQuery);
}
