import { notFound } from "next/navigation";
import BuildingExplorer from "@/components/afarizmi/BuildingExplorer";
import { getBuildingBySlug, getUnitsByBuilding, getSiteSettings, } from "@/sanity/lib/client";


type Props = {
  params: Promise<{
    locale: string;
    building: string;
  }>;
};

export default async function BuildingPage({ params }: Props) {
  const { building } = await params;

  const currentBuilding = await getBuildingBySlug(building);

  console.log("CURRENT BUILDING:", currentBuilding);

  if (!currentBuilding) {
    notFound();
  }

  const units = await getUnitsByBuilding(currentBuilding._id);
  const siteSettings = await getSiteSettings();
  if (!currentBuilding.facadeImage?.asset?.url) {
    return (
      <main>
        <h1>{currentBuilding.title}</h1>
        <p>Facade image nuk është vendosur ende.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{currentBuilding.title}</h1>
      </header>

      <BuildingExplorer
        building={currentBuilding}
        units={units}
        whatsappNumber={siteSettings?.whatsapp ?? ""}
      />
      
    </main>
  );
}