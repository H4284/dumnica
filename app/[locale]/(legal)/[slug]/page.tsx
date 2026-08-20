import { PortableText } from "@portabletext/react";

import { getPageBySlug } from "@/sanity/lib/client";

type LegalPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale, slug } = await params;

  const page = await getPageBySlug(slug, locale);

  if (!page) {
    return null;
  }

  return (
    <article>
      <h1>{page.title}</h1>

      {page.body && <PortableText value={page.body} />}
    </article>
  );
}