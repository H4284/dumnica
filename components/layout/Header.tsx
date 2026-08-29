import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import type { SiteSettingsQueryResult } from "@/sanity.types";
import Nav from "@/components/layout/Nav";
import MobileNav from "@/components/layout/MobileNav";
import LanguageSwitch from "@/components/layout/LanguageSwitch";
import TrackedExternalLink from "@/components/analytics/TrackedExternalLink";
import { Link } from "@/i18n/navigation";

type HeaderProps = {
  siteSettings: SiteSettingsQueryResult;
};

export default async function Header({ siteSettings }: HeaderProps) {
  const t = await getTranslations("common");

  return (
    <header>
      <div className="header-inner">
        <Link href="/">{t("brand")}</Link>

        <Nav />

        <MobileNav whatsapp={siteSettings?.whatsapp} />

        <div className="header-actions">
          <Suspense fallback={null}>
            <LanguageSwitch />
          </Suspense>

          {siteSettings?.whatsapp && (
            <TrackedExternalLink
              event="whatsapp_click"
              href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
            >
              {t("whatsapp")}
            </TrackedExternalLink>
          )}
        </div>
      </div>
    </header>
  );
}
