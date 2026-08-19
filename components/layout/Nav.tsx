"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavProps = {
  locale: string;
};

export default function Nav({ locale }: NavProps) {
  const pathname = usePathname();

  const links = [
    {
      label: "Afarizmi",
      href: `/${locale}/afarizmi`,
    },
    {
      label: "Projects",
      href: `/${locale}/projects`,
    },
  ];

  return (
    <nav aria-label="Main navigation" className="desktop-nav">
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