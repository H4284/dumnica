import { getAllProjects, getProjectBySlug } from "@/sanity/lib/client";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Gallery from "@/components/projects/Gallery";
import { Link } from "@/i18n/navigation";
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
  const tNav = await getTranslations("nav");
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
    <div className="page-shell pb-20">
      <JsonLd data={jsonLd} />

      <div className="site-container">
        <Breadcrumbs items={crumbs} label={tCommon("breadcrumb")} />
      </div>

      {project.mainPhoto?.asset?.url && (
        <section className="project-hero">
          <div className="project-hero-media">
            <Image
              src={project.mainPhoto.asset.url}
              alt={project.title || t("imageAlt")}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        </section>
      )}

      <div className="site-container">
        <section className="detail-section">
          <h1 className="page-title">{project.title}</h1>

          <div className="project-meta">
            {project.city && <span>{project.city}</span>}
            {statusKey && (
              <span>{t("statusLabel", { status: tStatus(statusKey) })}</span>
            )}
          </div>

          {project.description && (
            <p className="page-lede">{project.description}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kontakti" className="btn btn-primary">
              {tNav("contact")}
            </Link>
            <Link href="/afarizmi" className="btn btn-ghost">
              {tNav("afarizmi")}
            </Link>
          </div>
        </section>

        {project.video && (
          <section className="detail-section">
            <h2>{t("video")}</h2>
            <a
              href={project.video}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              {t("watchVideo")}
            </a>
          </section>
        )}

        {project.specifications && project.specifications.length > 0 && (
          <section className="detail-section">
            <h2>{t("specifications")}</h2>

            <ul className="stack-list">
              {project.specifications.map((specification, index) => (
                <li key={index}>{specification}</li>
              ))}
            </ul>
          </section>
        )}

        {project.amenities && project.amenities.length > 0 && (
          <section className="detail-section">
            <h2>{t("amenities")}</h2>

            <ul className="stack-list">
              {project.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </section>
        )}

        {project.paymentPlan && project.paymentPlan.length > 0 && (
          <section className="detail-section">
            <h2>{t("paymentPlan")}</h2>

            <ul className="stack-list">
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
          <section className="detail-section">
            <h2>{t("finishDate")}</h2>

            <p>{formatDate(project.finishDate, locale)}</p>
          </section>
        )}
      </div>
    </div>
  );
}
