"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

type FloorSelectorProps = {
  floorsCount: number;
  activeFloor: number;
  onFloorChange: (floor: number) => void;
};

export default function FloorSelector({
  floorsCount,
  activeFloor,
  onFloorChange,
}: FloorSelectorProps) {
  const t = useTranslations("floor");
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const floors = Array.from(
    { length: floorsCount + 1 },
    (_, index) => index,
  );

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    floor: number,
  ) {
    let nextFloor: number | null = null;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      nextFloor = Math.min(floor + 1, floorsCount);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      nextFloor = Math.max(floor - 1, 0);
    }

    if (nextFloor !== null) {
      onFloorChange(nextFloor);

      requestAnimationFrame(() => {
        buttonRefs.current[nextFloor]?.focus();
      });
    }
  }

  return (
    <div
      className="flex flex-col gap-2"
      role="listbox"
      aria-label={t("choose")}
    >
      {floors.map((floor) => {
        const isActive = floor === activeFloor;

        return (
          <button
            key={floor}
            ref={(element) => {
              buttonRefs.current[floor] = element;
            }}
            type="button"
            role="option"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onFloorChange(floor)}
            onKeyDown={(event) => handleKeyDown(event, floor)}
            className={`rounded-md px-4 py-2 text-left text-sm transition-colors ${
              isActive
                ? "bg-primary text-dark-text"
                : "bg-muted text-primary hover:bg-border"
            }`}
          >
            {floor === 0 ? t("ground") : t("n", { n: floor })}
          </button>
        );
      })}
    </div>
  );
}