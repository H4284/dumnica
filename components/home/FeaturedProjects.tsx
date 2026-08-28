import { getTranslations } from "next-intl/server";

import type { AllProjectsQueryResult } from "@/sanity.types";
import ProjectCard from "@/components/projects/ProjectCard";

type FeaturedProjectsProps = {
  projects: AllProjectsQueryResult;
};

export default async function FeaturedProjects({
  projects,
}: FeaturedProjectsProps) {
  const t = await getTranslations("home");
  const featuredProjects = projects.filter((project) => project.featured);

  if (featuredProjects.length === 0) return null;

  return (
    <section>
      <h2>{t("featuredProjects")}</h2>

      <div className="projects-grid">
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.slug?.current}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}
