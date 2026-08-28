export function formatFloorLabel(
  floor: number | null | undefined,
  labels: {
    ground: string;
    n: (n: number) => string;
  },
): string {
  if (floor === 0) {
    return labels.ground;
  }

  if (floor === null || floor === undefined) {
    return "—";
  }

  return labels.n(floor);
}

export function formatOrientation(
  codes: string[] | null | undefined,
  labels: {
    east: string;
    west: string;
    north: string;
    south: string;
  },
): string {
  if (!codes?.length) {
    return "—";
  }

  return codes
    .map((code) => {
      switch (code) {
        case "L":
          return labels.east;
        case "P":
          return labels.west;
        case "V":
          return labels.north;
        case "J":
          return labels.south;
        default:
          return code;
      }
    })
    .join(", ");
}
