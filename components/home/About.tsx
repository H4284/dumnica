import { getTranslations } from "next-intl/server";
import Image from "next/image";

import type { HomePageQueryResult } from "@/sanity.types";

type AboutProps = {
  homePage: NonNullable<HomePageQueryResult>;
};

export default async function About({ homePage }: AboutProps) {
  const t = await getTranslations("home");

  return (
    <section>
      <div>
        <h2>{homePage.aboutTitle}</h2>

        {homePage.aboutText && <p>{homePage.aboutText}</p>}
      </div>

      {homePage.aboutImage?.asset?.url && (
        <Image
          src={homePage.aboutImage.asset.url}
          alt={homePage.aboutTitle || t("aboutImageAlt")}
          width={homePage.aboutImage.asset.metadata?.dimensions?.width ?? 1094}
          height={homePage.aboutImage.asset.metadata?.dimensions?.height ?? 730}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
    </section>
  );
}
