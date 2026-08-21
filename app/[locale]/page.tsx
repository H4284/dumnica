import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Numbers from "@/components/home/Numbers";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";

import {
  getAllProjects,
  getHomePage,
  getSiteSettings,
} from "@/sanity/lib/client";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({
  params,
}: HomePageProps) {
  const { locale } = await params;

  const homePage = await getHomePage();
  const projects = await getAllProjects();
  const siteSettings = await getSiteSettings();

  if (!homePage || !siteSettings) {
    return null;
  }

  return (
    <main>
      <Hero homePage={homePage} />

      <FeaturedProjects
        projects={projects}
        locale={locale}
      />

      <Numbers homePage={homePage} />

      <About homePage={homePage} />

      <Contact siteSettings={siteSettings} />
    </main>
  );
}