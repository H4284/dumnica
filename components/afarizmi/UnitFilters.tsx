"use client";

import {
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useTranslations } from "next-intl";

type Props = {
  floorsCount: number;
};

export default function UnitFilters({ floorsCount }: Props) {
  const t = useTranslations("filters");
  const tFloor = useTranslations("floor");

  const [{ floor, rooms, minM2, maxM2, orientation, status, type }, setFilters] =
    useQueryStates({
      floor: parseAsInteger,
      rooms: parseAsInteger,
      minM2: parseAsInteger,
      maxM2: parseAsInteger,
      orientation: parseAsString,
      status: parseAsString.withDefault("i_lire"),
      type: parseAsString,
    });

  function clearFilters() {
    setFilters({
      floor: null,
      rooms: null,
      minM2: null,
      maxM2: null,
      orientation: null,
      status: "i_lire",
      type: null,
    });
  }

  return (
    <section className="mb-8 rounded-xl border border-border bg-surface p-5 text-primary shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-primary">{t("title")}</h2>
          <p className="text-sm text-secondary">{t("subtitle")}</p>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-primary underline hover:text-secondary"
        >
          {t("clear")}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">{t("floor")}</span>

          <select
            value={floor ?? ""}
            onChange={(event) =>
              setFilters({
                floor:
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
              })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary"
          >
            <option value="">{t("allFloors")}</option>

            {Array.from({ length: floorsCount + 1 }, (_, index) => (
              <option key={index} value={index}>
                {index === 0 ? tFloor("ground") : tFloor("n", { n: index })}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">{t("rooms")}</span>

          <select
            value={rooms ?? ""}
            onChange={(event) =>
              setFilters({
                rooms:
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
              })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary"
          >
            <option value="">{t("all")}</option>
            <option value="1">{t("roomsCount", { count: 1 })}</option>
            <option value="2">{t("roomsCount", { count: 2 })}</option>
            <option value="3">{t("roomsCount", { count: 3 })}</option>
            <option value="4">{t("roomsCount", { count: 4 })}</option>
            <option value="5">{t("roomsFivePlus")}</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">{t("minArea")}</span>

          <input
            type="number"
            min="0"
            value={minM2 ?? ""}
            onChange={(event) =>
              setFilters({
                minM2:
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
              })
            }
            placeholder={t("minPlaceholder")}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary placeholder:text-secondary"
          />
        </label>

        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">{t("maxArea")}</span>

          <input
            type="number"
            min="0"
            value={maxM2 ?? ""}
            onChange={(event) =>
              setFilters({
                maxM2:
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
              })
            }
            placeholder={t("maxPlaceholder")}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary placeholder:text-secondary"
          />
        </label>

        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">{t("orientation")}</span>

          <select
            value={orientation ?? ""}
            onChange={(event) => {
              void setFilters({
                orientation:
                  event.target.value === ""
                    ? null
                    : event.target.value,
              });
            }}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary"
          >
            <option value="">{t("all")}</option>
            <option value="L">{t("east")}</option>
            <option value="P">{t("west")}</option>
            <option value="V">{t("north")}</option>
            <option value="J">{t("south")}</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">{t("unitStatus")}</span>

          <select
            value={status}
            onChange={(event) =>
              setFilters({
                status: event.target.value,
              })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary"
          >
            <option value="i_lire">{t("onlyFree")}</option>
            <option value="i_rezervuar">{t("reserved")}</option>
            <option value="i_shitur">{t("sold")}</option>
            <option value="">{t("all")}</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">{t("type")}</span>

          <select
            value={type ?? ""}
            onChange={(event) =>
              setFilters({
                type: event.target.value === "" ? null : event.target.value,
              })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary"
          >
            <option value="">{t("all")}</option>
            <option value="banesor">{t("residential")}</option>
            <option value="afarist">{t("commercial")}</option>
          </select>
        </label>
      </div>

      <div className="mt-4 text-sm text-secondary">
        {t("urlFilters")}
        <span className="ml-2 font-mono">
          {floor !== null ? `floor=${floor} ` : ""}
          {rooms !== null ? `dhoma=${rooms} ` : ""}
          {minM2 !== null ? `minM2=${minM2} ` : ""}
          {maxM2 !== null ? `maxM2=${maxM2} ` : ""}
          {orientation ? `orientation=${orientation} ` : ""}
          {status ? `status=${status} ` : ""}
          {type ? `type=${type}` : ""}
        </span>
      </div>
    </section>
  );
}
