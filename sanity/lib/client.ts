import { createClient } from "next-sanity";
import type {
  AllProjectsQueryResult,
  PageBySlugQueryResult,
  ProjectBySlugQueryResult,
  SiteSettingsQueryResult,
} from "../../sanity.types";
import {
  allProjectsQuery,
  pageBySlugQuery,
  projectBySlugQuery,
  siteSettingsQuery,
} from "./queries";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-08-18",
  useCdn: true,
});

export async function getAllProjects(): Promise<AllProjectsQueryResult> {
  return client.fetch(allProjectsQuery);
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectBySlugQueryResult> {
  return client.fetch(projectBySlugQuery, { slug });
}

export async function getSiteSettings(): Promise<SiteSettingsQueryResult> {
  return client.fetch(siteSettingsQuery);
}

export async function getPageBySlug(
  slug: string,
): Promise<PageBySlugQueryResult> {
  return client.fetch(pageBySlugQuery, { slug });
}