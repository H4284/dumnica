import { getTranslations } from "next-intl/server";

import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilters from "@/components/projects/ProjectFilters";
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

export default async function ProjectsPage({
  params,
  searchParams,
}: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations("projects");
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

  return (
    <main>
      <h1>{t("title")}</h1>

      <ProjectFilters cities={cities} />

      <p>{t("count", { count: filteredProjects.length })}</p>

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
    </main>
  );
}
