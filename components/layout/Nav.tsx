"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    {
      label: t("afarizmi"),
      href: "/afarizmi" as const,
    },
    {
      label: t("projects"),
      href: "/projects" as const,
    },
  ];

  return (
    <nav aria-label={t("main")} className="desktop-nav">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
