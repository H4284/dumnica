import Link from "next/link";

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
  const projects = await getAllProjects();
  const filters = await searchParams;

  const city = filters.city;
  const status = filters.status;

  const cities = Array.from(
    new Set(
      projects
        .map((project) => project.city)
        .filter((city): city is string => Boolean(city))
    )
  ).sort();

  const filteredProjects = projects.filter((project) => {
    const matchesCity = !city || project.city === city;
    const matchesStatus = !status || project.status === status;

    return matchesCity && matchesStatus;
  });

  return (
    <main>
      <h1>Projects</h1>

      <ProjectFilters cities={cities} />

      <p>{filteredProjects.length} projects</p>

      {filteredProjects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div>
          {filteredProjects.map((project) => (
            <article key={project.slug?.current}>
              <h2>{project.title}</h2>

              {project.city && <p>{project.city}</p>}

              {project.status && <p>{project.status}</p>}

              {project.description && <p>{project.description}</p>}

              {project.slug?.current && (
                <Link
                  href={`/${locale}/projects/${project.slug.current}`}
                >
                  View project
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}