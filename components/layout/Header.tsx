import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import type { SiteSettingsQueryResult } from "@/sanity.types";
import Nav from "@/components/layout/Nav";
import MobileNav from "@/components/layout/MobileNav";
import LanguageSwitch from "@/components/layout/LanguageSwitch";
import HeaderBar from "@/components/layout/HeaderBar";
import TrackedExternalLink from "@/components/analytics/TrackedExternalLink";
import { Link } from "@/i18n/navigation";

type HeaderProps = {
  siteSettings: SiteSettingsQueryResult;
};

export default async function Header({ siteSettings }: HeaderProps) {
  const t = await getTranslations("common");

  return (
    <HeaderBar>
      <Link href="/" className="site-logo">
        {t("brand")}
      </Link>

      <Nav />

      <div className="header-actions">
        <Suspense fallback={null}>
          <LanguageSwitch />
        </Suspense>

        {siteSettings?.whatsapp && (
          <TrackedExternalLink
            event="whatsapp_click"
            href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
            className="btn btn-whatsapp"
          >
            {t("whatsapp")}
          </TrackedExternalLink>
        )}
      </div>

      <MobileNav whatsapp={siteSettings?.whatsapp} />
    </HeaderBar>
  );
}
