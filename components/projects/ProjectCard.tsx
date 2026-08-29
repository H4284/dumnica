"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import type { AllProjectsQueryResult } from "@/sanity.types";
import { Link } from "@/i18n/navigation";
import { projectStatusKey } from "@/lib/statusKeys";

type ProjectCardProps = {
  project: AllProjectsQueryResult[number];
  heading?: "h2" | "h3";
};

export default function ProjectCard({
  project,
  heading: Heading = "h2",
}: ProjectCardProps) {
  const t = useTranslations("projects");
  const tStatus = useTranslations("projectStatus");
  const imageUrl = project.mainPhoto?.asset?.url;
  const slug = project.slug?.current;
  const statusKey = projectStatusKey(project.status);

  if (!slug) return null;

  return (
    <article className="project-card">
      <Link
        href={`/projects/${slug}`}
        className="project-card-link"
        aria-label={t("viewProject", { title: project.title ?? slug })}
      >
        <div className="project-card-image">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={project.title || t("imageAlt")}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>

        <div className="project-card-content">
          {statusKey && (
            <span className="project-card-status">
              {tStatus(statusKey)}
            </span>
          )}

          <Heading>{project.title}</Heading>

          {project.city && <p>{project.city}</p>}

          {project.description && <p>{project.description}</p>}
        </div>
      </Link>
    </article>
  );
}
