"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import LanguageSwitch from "@/components/layout/LanguageSwitch";
import TrackedExternalLink from "@/components/analytics/TrackedExternalLink";
import { Link } from "@/i18n/navigation";

type MobileNavProps = {
  whatsapp?: string | null;
};

export default function MobileNav({ whatsapp }: MobileNavProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    document.documentElement.classList.add("mobile-menu-open");
    document.body.classList.add("mobile-menu-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("mobile-menu-open");
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isOpen]);

  const menu =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeMenu();
              }
            }}
          >
            <button
              type="button"
              className="mobile-menu-button mobile-menu-close"
              aria-label={t("closeMenu")}
              onClick={closeMenu}
            >
              ✕
            </button>

            <nav aria-label={t("mobile")}>
              <Link href="/afarizmi" onClick={closeMenu}>
                {t("afarizmi")}
              </Link>

              <Link href="/projects" onClick={closeMenu}>
                {t("projects")}
              </Link>

              <Link href="/kontakti" onClick={closeMenu}>
                {t("contact")}
              </Link>

              <div onClick={closeMenu}>
                <Suspense fallback={null}>
                  <LanguageSwitch />
                </Suspense>
              </div>

              {whatsapp && (
                <TrackedExternalLink
                  event="whatsapp_click"
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  onClick={closeMenu}
                  className="btn btn-whatsapp"
                >
                  {tCommon("whatsapp")}
                </TrackedExternalLink>
              )}
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="mobile-nav">
      <button
        ref={buttonRef}
        type="button"
        className="mobile-menu-button"
        aria-label={isOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {menu}
    </div>
  );
}
