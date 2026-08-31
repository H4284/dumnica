import { getLocale, getTranslations } from "next-intl/server";

import type { HomePageQueryResult } from "@/sanity.types";
import { formatNumber } from "@/i18n/routing";

type NumbersProps = {
  homePage: NonNullable<HomePageQueryResult>;
};

export default async function Numbers({ homePage }: NumbersProps) {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const items = [
    {
      value: homePage.yearsOfExperience,
      label: t("yearsOfExperience"),
    },
    {
      value: homePage.finishedProjects,
      label: t("finishedProjects"),
    },
    {
      value: homePage.apartmentsDelivered,
      label: t("apartmentsDelivered"),
    },
  ];

  return (
    <section className="numbers-band section">
      <div className="site-container numbers-grid">
        {items.map((item) => (
          <div key={item.label}>
            <strong>
              {item.value != null ? formatNumber(item.value, locale) : null}
            </strong>
            <span className="mt-3 block text-sm tracking-wide text-dark-muted">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
