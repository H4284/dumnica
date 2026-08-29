import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import ContactForm from "@/components/forms/ContactForm";
import type { AppLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { getAllProjects } from "@/sanity/lib/client";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations("contactForm");

  return pageMetadata({
    locale,
    href: "/kontakti",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const [t, projects] = await Promise.all([
    getTranslations("contactForm"),
    getAllProjects(locale),
  ]);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">{t("title")}</h1>
      <p className="mb-8 text-secondary">{t("intro")}</p>

      <ContactForm
        projects={projects
          .filter((project) => project.slug?.current && project.title)
          .map((project) => ({
            slug: project.slug!.current!,
            title: project.title!,
          }))}
      />
    </main>
  );
}
