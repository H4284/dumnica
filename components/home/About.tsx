import { getTranslations } from "next-intl/server";

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
        <img
          src={homePage.aboutImage.asset.url}
          alt={homePage.aboutTitle || t("aboutImageAlt")}
        />
      )}
    </section>
  );
}
