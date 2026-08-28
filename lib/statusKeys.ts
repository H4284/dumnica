export function unitStatusKey(
  status: string | null | undefined,
): "free" | "reserved" | "sold" | "unknown" {
  switch (status) {
    case "i_lire":
      return "free";
    case "i_rezervuar":
      return "reserved";
    case "i_shitur":
      return "sold";
    default:
      return "unknown";
  }
}

export function projectStatusKey(
  status: string | null | undefined,
): "construction" | "finished" | "comingSoon" | null {
  switch (status) {
    case "construction":
      return "construction";
    case "finished":
      return "finished";
    case "coming-soon":
      return "comingSoon";
    default:
      return null;
  }
}
