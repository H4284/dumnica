import type { SiteSettingsQueryResult } from "@/sanity.types";
import Nav from "@/components/layout/Nav";
import MobileNav from "@/components/layout/MobileNav";
import LanguageSwitch from "@/components/layout/LanguageSwitch";
import Link from "next/link";

type HeaderProps = {
  siteSettings: SiteSettingsQueryResult;
  locale: string;
};

export default function Header({ siteSettings, locale }: HeaderProps) {
    return (
      <header>
       <div className="header-inner">
       <Link href={`/${locale}`}>
          Dumnica
        </Link>
  
        <Nav locale={locale} />
  
        <MobileNav
  locale={locale}
  whatsapp={siteSettings?.whatsapp}
/>
        <div className="header-actions">
  <LanguageSwitch locale={locale} />

  {siteSettings?.whatsapp && (
    <a
      href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
    >
      WhatsApp
    </a>
  )}
</div>
        </div>
      </header>
    );
  }