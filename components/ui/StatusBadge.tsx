"use client";

import { useTranslations } from "next-intl";

type Status = "free" | "reserved" | "sold";

type StatusBadgeProps = {
  status: Status;
};

const statusClassName = {
  free: "bg-status-free/10 text-status-free border-status-free",
  reserved:
    "bg-status-reserved/10 text-status-reserved border-status-reserved",
  sold: "bg-status-sold/10 text-status-sold border-status-sold",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("unitStatus");

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusClassName[status]}`}
    >
      <span
        aria-hidden="true"
        className="mr-2 h-2 w-2 rounded-full bg-current"
      />
      {t(status)}
    </span>
  );
}
