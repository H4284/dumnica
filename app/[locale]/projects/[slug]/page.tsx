import { getAllProjects, getProjectBySlug } from "@/sanity/lib/client";
import type { Metadata } from "next";
import Image from "next/image";
import Gallery from "@/components/projects/Gallery";
import LocationMap from "@/components/projects/LocationMap";
import BrochureDownload from "@/components/projects/BrochureDownload";

type ProjectPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects();

  return projects
    .filter((project) => project.slug?.current)
    .flatMap((project) => [
      {
        locale: "sq",
        slug: project.slug!.current!,
      },
      {
        locale: "en",
        slug: project.slug!.current!,
      },
    ]);
}
export async function generateMetadata({
    params,
  }: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
  
    if (!project) {
      return {
        title: "Project not found | Dumnica",
        description: "Project not found.",
      };
    }
  
    return {
      title: `${project.title} | Dumnica`,
      description:
        project.description ||
        `Mësoni më shumë për projektin ${project.title}.`,
    };
    
  }

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);


  console.log("PROJECT:", project);
  if (!project) {
    return null;
  }

  return (
    <main>
      {project.mainPhoto?.asset?.url && (
        <section>
          <Image
            src={project.mainPhoto.asset.url}
            alt={project.title || "Project"}
            width={1600}
            height={900}
            priority
          />
        </section>
      )}
  
      <section>
        <h1>{project.title}</h1>
  
        {project.city && <p>{project.city}</p>}
  
        {project.description && (
          <p  className="prose-text" >{project.description}</p>
        )}
      </section>

      {project.video && (
        <section>
          <h2>Video</h2>
          <a
            href={project.video}
            target="_blank"
            rel="noopener noreferrer"
          >
            Shiko videon
          </a>
        </section>
      )}
        
      {project.specifications &&
        project.specifications.length > 0 && (
          <section>
            <h2>Specifications</h2>
  
            <ul>
              {project.specifications.map((specification, index) => (
                <li key={index}>{specification}</li>
              ))}
            </ul>
          </section>
        )}
  
      {project.amenities &&
        project.amenities.length > 0 && (
          <section>
            <h2>Amenities</h2>
  
            <ul>
              {project.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </section>
        )}

        {project.paymentPlan && project.paymentPlan.length > 0 && (
      <section>
        <h2>Plani i pagesës</h2>

      <ul>
        {project.paymentPlan.map((payment, index) => (
          <li key={index}>
            {payment.label && <span>{payment.label}</span>}
            {payment.percentage !== null &&
              payment.percentage !== undefined && (
                <span>{payment.percentage}%</span>
              )}
          </li>
      ))}
    </ul>
  </section>
)}

{project.gallery && project.gallery.length > 0 && (
  <Gallery
    images={project.gallery}
    title={project.title || "Project"}
  />
)}

{project.brochure?.asset?.url && (
  <BrochureDownload url={project.brochure.asset.url} />
)}

{project.location && (
  <LocationMap
    latitude={project.location.lat}
    longitude={project.location.lng}
  />
)}

{project.finishDate && (
  <section>
    <h2>Finish Date</h2>

    <p>{project.finishDate}</p>
  </section>
)}

{project.status && (
  <p>Status: {project.status}</p>
)}
    </main>
  );
}