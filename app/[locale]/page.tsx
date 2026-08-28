import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Numbers from "@/components/home/Numbers";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import HashRedirect from "@/components/redirects/HashRedirect";

import {
  getAllProjects,
  getHomePage,
  getSiteSettings,
} from "@/sanity/lib/client";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const homePage = await getHomePage(locale);
  const projects = await getAllProjects(locale);
  const siteSettings = await getSiteSettings();

  if (!homePage || !siteSettings) {
    return null;
  }

  return (
    <main>

      <Hero homePage={homePage} />

      <FeaturedProjects projects={projects} />

      <Numbers homePage={homePage} />

      <About homePage={homePage} />

      <Contact siteSettings={siteSettings} />

      <HashRedirect />
    </main>
  );
}