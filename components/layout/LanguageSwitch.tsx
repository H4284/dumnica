"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type LanguageSwitchProps = {
  locale: string;
};

export default function LanguageSwitch({
  locale,
}: LanguageSwitchProps) {
  const pathname = usePathname();

  const newLocale = locale === "en" ? "sq" : "en";
  const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);

  return <Link href={newPathname}>{newLocale.toUpperCase()}</Link>;
}