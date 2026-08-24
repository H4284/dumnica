type Status = "free" | "reserved" | "sold";

type StatusBadgeProps = {
  status: Status;
};

const statusConfig = {
  free: {
    label: "Free",
    className: "bg-status-free/10 text-status-free border-status-free",
  },
  reserved: {
    label: "Reserved",
    className:
      "bg-status-reserved/10 text-status-reserved border-status-reserved",
  },
  sold: {
    label: "Sold",
    className: "bg-status-sold/10 text-status-sold border-status-sold",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${config.className}`}
    >
      <span
        aria-hidden="true"
        className="mr-2 h-2 w-2 rounded-full bg-current"
      />
      {config.label}
    </span>
  );
}