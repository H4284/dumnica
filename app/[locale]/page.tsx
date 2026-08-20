import Hero from "@/components/home/Hero";
import { getAllProjects, getHomePage, getSiteSettings } from "@/sanity/lib/client";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Numbers from "@/components/home/Numbers";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";

export default async function HomePage() {
  const homePage = await getHomePage();
  const projects = await getAllProjects();
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
    </main>
  );
}