import { getAllProjects, getProjectBySlug } from "@/sanity/lib/client";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Gallery from "@/components/projects/Gallery";
import LocationMap from "@/components/projects/LocationMap";
import BrochureDownload from "@/components/projects/BrochureDownload";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { formatDate, routing, type AppLocale } from "@/i18n/routing";
import { projectStatusKey } from "@/lib/statusKeys";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

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
    .flatMap((project) =>
      routing.locales.map((locale) => ({
        locale,
        slug: project.slug!.current!,
      })),
    );
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale as AppLocale);

  const [project, t] = await Promise.all([
    getProjectBySlug(slug, locale),
    getTranslations("projects"),
  ]);
  const href = `/projects/${slug}`;

  if (!project) {
    return pageMetadata({
      locale,
      href,
      title: t("title"),
      description: t("empty"),
    });
  }

  const title = project.title || project.slug?.current || t("title");
  const description =
    project.description ||
    [project.title, project.city].filter(Boolean).join(" — ") ||
    title;

  return pageMetadata({
    locale,
    href,
    title,
    description,
    image: project.mainPhoto?.asset?.url,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("projects");
  const tCommon = await getTranslations("common");
  const tStatus = await getTranslations("projectStatus");
  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    return null;
  }

  const statusKey = projectStatusKey(project.status);
  const href = `/projects/${slug}`;
  const title = project.title || project.slug?.current || t("title");

  const crumbs = [
    { href: "/", label: tCommon("home") },
    { href: "/projects", label: t("title") },
    { label: title },
  ];

  const jsonLd = [
    {
      "@type": "ApartmentComplex",
      name: title,
      url: absoluteUrl(locale, href),
      ...(project.description ? { description: project.description } : {}),
      ...(project.mainPhoto?.asset?.url
        ? { image: project.mainPhoto.asset.url }
        : {}),
      ...(project.city
        ? {
            address: {
              "@type": "PostalAddress",
              addressLocality: project.city,
            },
          }
        : {}),
      ...(project.location
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: project.location.lat,
              longitude: project.location.lng,
            },
          }
        : {}),
    },
    breadcrumbJsonLd(locale, [
      { name: tCommon("home"), href: "/" },
      { name: t("title"), href: "/projects" },
      { name: title, href },
    ]),
  ];

  return (
    <main>
      <JsonLd data={jsonLd} />

      <Breadcrumbs items={crumbs} label={tCommon("breadcrumb")} />

      {project.mainPhoto?.asset?.url && (
        <section>
          <Image
            src={project.mainPhoto.asset.url}
            alt={project.title || t("imageAlt")}
            width={1600}
            height={900}
            sizes="(max-width: 768px) 100vw, 1600px"
            priority
          />
        </section>
      )}

      <section>
        <h1>{project.title}</h1>

        {project.city && <p>{project.city}</p>}

        {project.description && (
          <p className="prose-text">{project.description}</p>
        )}
      </section>

      {project.video && (
        <section>
          <h2>{t("video")}</h2>
          <a
            href={project.video}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("watchVideo")}
          </a>
        </section>
      )}

      {project.specifications && project.specifications.length > 0 && (
        <section>
          <h2>{t("specifications")}</h2>

          <ul>
            {project.specifications.map((specification, index) => (
              <li key={index}>{specification}</li>
            ))}
          </ul>
        </section>
      )}

      {project.amenities && project.amenities.length > 0 && (
        <section>
          <h2>{t("amenities")}</h2>

          <ul>
            {project.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </section>
      )}

      {project.paymentPlan && project.paymentPlan.length > 0 && (
        <section>
          <h2>{t("paymentPlan")}</h2>

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
          title={project.title || t("imageAlt")}
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
          <h2>{t("finishDate")}</h2>

          <p>{formatDate(project.finishDate, locale)}</p>
        </section>
      )}

      {statusKey && (
        <p>{t("statusLabel", { status: tStatus(statusKey) })}</p>
      )}
    </main>
  );
}
