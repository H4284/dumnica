"use client";

import { parseAsString, useQueryState } from "nuqs";

const statuses = [
  { value: "construction", label: "Në ndërtim" },
  { value: "finished", label: "I përfunduar" },
  { value: "coming-soon", label: "Së shpejti" },
];

type ProjectFiltersProps = {
  cities: string[];
};

export default function ProjectFilters({
  cities,
}: ProjectFiltersProps) {
  const [city, setCity] = useQueryState(
    "city",
    parseAsString.withDefault("").withOptions({
      shallow: false,
    })
  );

  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("").withOptions({
      shallow: false,
    })
  );

  return (
    <div>
      <label>
        City

        <select
          value={city}
          onChange={(event) =>
            setCity(event.target.value || null)
          }
        >
          <option value="">All cities</option>

          {cities.map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
      </label>

      <label>
        Status

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value || null)
          }
        >
          <option value="">All statuses</option>

          {statuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}