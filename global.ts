import { routing } from "./i18n/routing";
import sq from "./messages/sq.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof sq;
  }
}
