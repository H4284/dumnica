import Link from "next/link";
import type { AllProjectsQueryResult } from "@/sanity.types";

type FeaturedProjectsProps = {
  projects: AllProjectsQueryResult;
};

export default function FeaturedProjects({
  projects,
}: FeaturedProjectsProps) {
  const featuredProjects = projects.filter((project) => project.featured);

  if (featuredProjects.length === 0) return null;

  return (
    <section>
      <h2>Featured Projects</h2>

      {featuredProjects.map((project) => (
        <article key={project.slug?.current}>
          <h3>{project.title}</h3>

          {project.city && <p>{project.city}</p>}

          {project.description && <p>{project.description}</p>}

          {project.slug?.current && (
            <Link href={`/projects/${project.slug.current}`}>
              View project
            </Link>
          )}
        </article>
      ))}
    </section>
  );
}