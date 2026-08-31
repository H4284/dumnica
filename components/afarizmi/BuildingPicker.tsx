import Image from "next/image";
import { getTranslations } from "next-intl/server";

import type { AllBuildingsQueryResult } from "../../sanity.types";
import { Link } from "@/i18n/navigation";

type BuildingPickerProps = {
  buildings: AllBuildingsQueryResult;
};

export default async function BuildingPicker({
  buildings,
}: BuildingPickerProps) {
  const t = await getTranslations("afarizmi");

  if (buildings.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg">{t("emptyBuildings")}</p>
      </div>
    );
  }

  return (
    <div className="building-grid">
      {buildings.map((building) => {
        const imageUrl = building.facadeImage?.asset?.url;

        return (
          <Link
            key={building._id}
            href={
              building.slug
                ? `/afarizmi/${building.slug}`
                : "/afarizmi"
            }
            className="group block overflow-hidden"
          >
            <article>
              <div className="relative aspect-[16/10] overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={building.title ?? t("buildingAlt")}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span>{t("noImage")}</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <h2 className="font-display text-2xl font-medium">
                  {building.title}
                </h2>

                <p className="mt-1 text-secondary">
                  {t("freeUnits", {
                    free: building.free ?? 0,
                    total: building.total ?? 0,
                  })}
                </p>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
