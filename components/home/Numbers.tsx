import { getLocale, getTranslations } from "next-intl/server";

import type { HomePageQueryResult } from "@/sanity.types";
import { formatNumber } from "@/i18n/routing";

type NumbersProps = {
  homePage: NonNullable<HomePageQueryResult>;
};

export default async function Numbers({ homePage }: NumbersProps) {
  const t = await getTranslations("home");
  const locale = await getLocale();

  return (
    <section>
      <div>
        <strong>
          {homePage.yearsOfExperience != null
            ? formatNumber(homePage.yearsOfExperience, locale)
            : null}
        </strong>
        <span>{t("yearsOfExperience")}</span>
      </div>

      <div>
        <strong>
          {homePage.finishedProjects != null
            ? formatNumber(homePage.finishedProjects, locale)
            : null}
        </strong>
        <span>{t("finishedProjects")}</span>
      </div>

      <div>
        <strong>
          {homePage.apartmentsDelivered != null
            ? formatNumber(homePage.apartmentsDelivered, locale)
            : null}
        </strong>
        <span>{t("apartmentsDelivered")}</span>
      </div>
    </section>
  );
}
