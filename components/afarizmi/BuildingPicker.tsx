import Image from "next/image";
import Link from "next/link";

import type { AllBuildingsQueryResult } from "../../sanity.types";

type BuildingPickerProps = {
  buildings: AllBuildingsQueryResult;
  locale:string;
};

export default function BuildingPicker({
  buildings,
  locale,
}: BuildingPickerProps) {
  if (buildings.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg">
          Për momentin nuk ka ndërtesa të disponueshme.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {buildings.map((building) => {
        const imageUrl = building.facadeImage?.asset?.url;

        return (
          <Link
            key={building._id}
            href={
              building.slug
                ? `/${locale}/afarizmi/${building.slug}`
                : `/${locale}/afarizmi`
            }
            className="group block overflow-hidden rounded-lg"
          >
            <article>
              <div className="relative aspect-[16/10] overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={building.title ?? "Building"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span>No image</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <h2 className="text-xl font-semibold">
                  {building.title}
                </h2>

                <p className="mt-1">
                  {building.free} nga {building.total} njësi të lira
                </p>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}