"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useTranslations } from "next-intl";

const statusValues = ["construction", "finished", "coming-soon"] as const;

export type CityOption = {
  key: string;
  label: string;
};

type ProjectFiltersProps = {
  cities: CityOption[];
};

export default function ProjectFilters({ cities }: ProjectFiltersProps) {
  const t = useTranslations("projects");
  const tStatus = useTranslations("projectStatus");
  const [city, setCity] = useQueryState(
    "city",
    parseAsString.withDefault("").withOptions({
      shallow: false,
    }),
  );

  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("").withOptions({
      shallow: false,
    }),
  );

  return (
    <div className="filter-bar">
      <label>
        {t("city")}

        <select
          className="field-select"
          value={city}
          onChange={(event) => setCity(event.target.value || null)}
        >
          <option value="">{t("allCities")}</option>

          {cities.map((cityOption) => (
            <option key={cityOption.key} value={cityOption.key}>
              {cityOption.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        {t("status")}

        <select
          className="field-select"
          value={status}
          onChange={(event) => setStatus(event.target.value || null)}
        >
          <option value="">{t("allStatuses")}</option>

          {statusValues.map((item) => (
            <option key={item} value={item}>
              {tStatus(
                item === "coming-soon" ? "comingSoon" : item,
              )}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
