import { getTranslations } from "next-intl/server";

import type { AllProjectsQueryResult } from "@/sanity.types";
import ProjectCard from "@/components/projects/ProjectCard";
import { Link } from "@/i18n/navigation";

type FeaturedProjectsProps = {
  projects: AllProjectsQueryResult;
};

export default async function FeaturedProjects({
  projects,
}: FeaturedProjectsProps) {
  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");
  const featuredProjects = projects.filter((project) => project.featured);

  if (featuredProjects.length === 0) return null;

  return (
    <section className="section">
      <div className="site-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">{tNav("projects")}</p>
            <h2 className="section-title">{t("featuredProjects")}</h2>
          </div>
          <Link href="/projects" className="btn btn-ghost text-primary">
            {tNav("projects")}
          </Link>
        </div>

        <div className="projects-grid">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug?.current}
              project={project}
              heading="h3"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
