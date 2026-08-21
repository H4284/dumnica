import Image from "next/image";
import Link from "next/link";

import type { AllProjectsQueryResult } from "@/sanity.types";

type ProjectCardProps = {
  project: AllProjectsQueryResult[number];
  locale: string;
};

const statusLabels = {
  construction: "Në ndërtim",
  finished: "I përfunduar",
  "coming-soon": "Së shpejti",
};

export default function ProjectCard({
  project,
  locale,
}: ProjectCardProps) {
  const imageUrl = project.mainPhoto?.asset?.url;
  const slug = project.slug?.current;

  if (!slug) return null;

  return (
    <article className="project-card">
      <Link
        href={`/${locale}/projects/${slug}`}
        className="project-card-link"
        aria-label={`View ${project.title}`}
      >
        <div className="project-card-image">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={project.title || "Project"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>

        <div className="project-card-content">
          {project.status && (
            <span className="project-card-status">
              {statusLabels[
                project.status as keyof typeof statusLabels
              ] || project.status}
            </span>
          )}

          <h2>{project.title}</h2>

          {project.city && <p>{project.city}</p>}

          {project.description && (
            <p>{project.description}</p>
          )}
        </div>
      </Link>
    </article>
  );
}