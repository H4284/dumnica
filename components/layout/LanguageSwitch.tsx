"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitch() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  const href =
    Object.keys(query).length > 0
      ? { pathname, query }
      : pathname;

  return (
    <nav aria-label={t("switchLanguage")} className="lang-switch">
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={href}
          locale={item}
          hrefLang={item}
          aria-current={item === locale ? "true" : undefined}
        >
          {item.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
