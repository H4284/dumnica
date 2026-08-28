import { routing } from "@/i18n/routing";

export function toLocalePath(href: string): string {
  const localePattern = new RegExp(
    `^/(${routing.locales.join("|")})(?=/|$)`,
  );

  return href.replace(localePattern, "") || "/";
}
