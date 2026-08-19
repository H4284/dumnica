"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LanguageSwitch from "@/components/layout/LanguageSwitch";

type MobileNavProps = {
    locale: string;
    whatsapp?: string | null;
  };

export default function MobileNav({ locale, whatsapp }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key === "Tab" && focusableElements.length > 0) {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="mobile-nav">
    <button
      ref={buttonRef}
      type="button"
      className="mobile-menu-button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "✕" : "☰"}
    </button>
  
    {isOpen && (
      <div
        ref={menuRef}
        id="mobile-menu"
        className="mobile-menu"
        role="dialog"
        aria-modal="true"
      >
      <nav aria-label="Mobile navigation">
  <Link href={`/${locale}/afarizmi`} onClick={closeMenu}>
    Afarizmi
  </Link>

  <Link href={`/${locale}/projects`} onClick={closeMenu}>
    Projects
  </Link>

  <div onClick={closeMenu}>
    <LanguageSwitch locale={locale} />
  </div>

  {whatsapp && (
    <a
      href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
      onClick={closeMenu}
    >
      WhatsApp
    </a>
  )}
</nav>
      </div>
    )}
  </div>
  );
}