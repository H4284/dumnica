import Image from "next/image";
import {
    getBuildingBySlug,
    getUnitsByBuilding,
  } from "@/sanity/lib/client";
  
  type Props = {
    params: Promise<{
      locale: string;
      building: string;
    }>;
  };
  
  export default async function BuildingPage({ params }: Props) {
    const { building } = await params;
  
    const currentBuilding = await getBuildingBySlug(building);
  
    if (!currentBuilding) {
      return <div>Building not found</div>;
    }
  
    const units = await getUnitsByBuilding(currentBuilding._id);
  
    return (
      <main>
        <h1>{currentBuilding.title}</h1>
        
                {currentBuilding.facadeImage?.asset?.url && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
            src={currentBuilding.facadeImage.asset.url}
            alt={currentBuilding.title ?? "Building facade"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            />
        </div>
        )}
        
        <p>Slug: {currentBuilding.slug}</p>
  
        <p>Units: {units.length}</p>
  
        <ul>
          {units.map((unit) => (
            <li key={unit._id}>
              {unit.code} — {unit.status}
            </li>
          ))}
        </ul>
      </main>
    );
  }