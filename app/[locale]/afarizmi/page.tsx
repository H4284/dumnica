import { getAllBuildings, getHomePage } from "@/sanity/lib/client";
import BuildingPicker from "@/components/afarizmi/BuildingPicker";

type AfarizmiPageProps = {
    params: Promise<{
      locale: string;
    }>;
  };

  export default async function AfarizmiPage({
    params,
  }: AfarizmiPageProps) {
    const { locale } = await params;
    
  const [homePage, buildings] = await Promise.all([
    getHomePage(),
    getAllBuildings(),
  ]);

  return (
    <main>
      <section>
        {homePage?.afarizmiIntro && (
          <p>{homePage.afarizmiIntro}</p>
        )}

        <BuildingPicker buildings={buildings} 
        locale={locale}/>
      </section>
    </main>
  );
}