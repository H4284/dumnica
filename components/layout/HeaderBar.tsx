"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

type HeaderBarProps = {
  children: React.ReactNode;
};

export default function HeaderBar({ children }: HeaderBarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const solid = !isHome || scrolled;

  return (
    <header
      className={`site-header ${solid ? "is-solid" : "is-transparent"}`}
    >
      <div className="site-header-backdrop" aria-hidden="true" />
      <div className="site-container site-header-inner">{children}</div>
    </header>
  );
}
