import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilters from "@/components/projects/ProjectFilters";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { getAllProjects } from "@/sanity/lib/client";

type ProjectsPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    city?: string;
    status?: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const [t, projects] = await Promise.all([
    getTranslations("projects"),
    getAllProjects(locale),
  ]);

  const title = t("title");

  return pageMetadata({
    locale,
    href: "/projects",
    title,
    description: t("count", { count: projects.length }),
  });
}

export default async function ProjectsPage({
  params,
  searchParams,
}: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("projects");
  const tCommon = await getTranslations("common");
  const projects = await getAllProjects(locale);
  const filters = await searchParams;

  const city = filters.city;
  const status = filters.status;

  const cities = Array.from(
    new Map(
      projects
        .filter((project) => project.cityKey)
        .map((project) => [
          project.cityKey as string,
          project.city ?? (project.cityKey as string),
        ]),
    ).entries(),
  )
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));

  const filteredProjects = projects.filter((project) => {
    const matchesCity = !city || project.cityKey === city;
    const matchesStatus = !status || project.status === status;

    return matchesCity && matchesStatus;
  });

  const crumbs = [
    { href: "/", label: tCommon("home") },
    { label: t("title") },
  ];

  return (
    <div className="page-shell">
      <div className="site-container pb-20">
        <JsonLd
          data={breadcrumbJsonLd(locale, [
            { name: tCommon("home"), href: "/" },
            { name: t("title"), href: "/projects" },
          ])}
        />

        <Breadcrumbs items={crumbs} label={tCommon("breadcrumb")} />

        <header className="pt-4 pb-2">
          <h1 className="page-title">{t("title")}</h1>
        </header>

        <ProjectFilters cities={cities} />

        <p className="mb-10 text-secondary">
          {t("count", { count: filteredProjects.length })}
        </p>

        {filteredProjects.length === 0 ? (
          <p>{t("empty")}</p>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.slug?.current}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
