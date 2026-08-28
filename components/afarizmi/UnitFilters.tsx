"use client";

import {
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

type Props = {
  floorsCount: number;
};

export default function UnitFilters({ floorsCount }: Props) {
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
          <h2 className="text-lg font-semibold text-primary">Filtro njësitë</h2>
          <p className="text-sm text-secondary">
            Zgjidh kriteret për të gjetur njësinë.
          </p>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-primary underline hover:text-secondary"
        >
          Pastro filtrat
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Kati */}
        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">Kati</span>

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
            <option value="">Të gjitha katet</option>

            {Array.from({ length: floorsCount + 1 }, (_, index) => (
              <option key={index} value={index}>
                {index === 0 ? "Përdhesë" : `Kati ${index}`}
              </option>
            ))}
          </select>
        </label>

        {/* Dhoma */}
        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">Dhoma</span>

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
            <option value="">Të gjitha</option>
            <option value="1">1 dhomë</option>
            <option value="2">2 dhoma</option>
            <option value="3">3 dhoma</option>
            <option value="4">4 dhoma</option>
            <option value="5">5+ dhoma</option>
          </select>
        </label>

        {/* Minimum m² */}
        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">Min. m²</span>

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
            placeholder="p.sh. 50"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary placeholder:text-secondary"
          />
        </label>

        {/* Maximum m² */}
        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">Max. m²</span>

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
            placeholder="p.sh. 120"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary placeholder:text-secondary"
          />
        </label>

        {/* Orientimi */}
        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">
            Orientimi
          </span>

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
            <option value="">
              Të gjitha
            </option>

            <option value="L">
              Lindje
            </option>

            <option value="P">
              Perëndim
            </option>

            <option value="V">
              Veri
            </option>

            <option value="J">
              Jug
            </option>
          </select>
        </label>

        {/* Status */}
        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">Statusi</span>

          <select
            value={status}
            onChange={(event) =>
              setFilters({
                status: event.target.value,
              })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary"
          >
            <option value="i_lire">Vetëm të lira</option>
            <option value="i_rezervuar">Të rezervuara</option>
            <option value="i_shitur">Të shitura</option>
            <option value="">Të gjitha</option>
          </select>
        </label>

        {/* Tipi */}
        <label className="flex flex-col gap-2 text-primary">
          <span className="text-sm font-medium">Tipi</span>

          <select
            value={type ?? ""}
            onChange={(event) =>
              setFilters({
                type: event.target.value === "" ? null : event.target.value,
              })
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 text-primary"
          >
            <option value="">Të gjitha</option>
            <option value="banesor">Banesor</option>
            <option value="afarist">Afarist</option>
          </select>
        </label>
      </div>

      <div className="mt-4 text-sm text-secondary">
        URL filters:
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