import type { SiteSettingsQueryResult } from "@/sanity.types";

type HeaderProps = {
  siteSettings: SiteSettingsQueryResult;
};

export default function Header({ siteSettings }: HeaderProps) {
    return (
      <header>
        <div>
          <a href="/">Dumnica</a>
  
          <nav>
            <a href="/afarizmi">Afarizmi</a>
            <a href="/projects">Projects</a>

          </nav>
  
          <div>
            <button>EN</button>
            {siteSettings?.whatsapp && (
            <a href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}>
              WhatsApp
            </a>
          )}
          </div>
        </div>
      </header>
    );
  }