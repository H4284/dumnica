import type { AllProjectsQueryResult } from "@/sanity.types";
import ProjectCard from "@/components/projects/ProjectCard";

type FeaturedProjectsProps = {
  projects: AllProjectsQueryResult;
  locale: string;
};

export default function FeaturedProjects({
  projects, locale
}: FeaturedProjectsProps) {
  const featuredProjects = projects.filter((project) => project.featured);

  if (featuredProjects.length === 0) return null;

  return (
    <section>
      <h2>Featured Projects</h2>

      <div className="projects-grid">
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.slug?.current}
            project={project}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}