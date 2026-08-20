import type { SiteSettingsQueryResult } from "@/sanity.types";

type FooterProps = {
  siteSettings: SiteSettingsQueryResult;
  locale: string;
};

export default function Footer({ siteSettings, locale }: FooterProps) {
  return (
    <footer>
      <div>
        <div>
          <h2>Dumnica</h2>

          {siteSettings?.phone && <p>Phone: {siteSettings.phone}</p>}

          {siteSettings?.email && <p>Email: {siteSettings.email}</p>}

          {siteSettings?.address && <p>Address: {siteSettings.address}</p>}
        </div>

        <nav>
          <a href={`/${locale}/afarizmi`}>Afarizmi</a>
          <a href={`/${locale}/projects`}>Projects</a>
        </nav>

        <div>
          {siteSettings?.socialLinks?.instagram && (
            <a href={siteSettings.socialLinks.instagram}>Instagram</a>
          )}

          {siteSettings?.socialLinks?.facebook && (
            <a href={siteSettings.socialLinks.facebook}>Facebook</a>
          )}

          {siteSettings?.socialLinks?.linkedin && (
            <a href={siteSettings.socialLinks.linkedin}>LinkedIn</a>
          )}
        </div>
      </div>

      <div>
      <a
  href={
    locale === "sq"
      ? "/sq/politika-e-privatesise"
      : "/en/privacy-policy"
  }
>
  {locale === "sq" ? "Politika e Privatësisë" : "Privacy Policy"}
</a>

<a
  href={
    locale === "sq"
      ? "/sq/kushtet-e-perdorimit"
      : "/en/terms"
  }
>
  {locale === "sq" ? "Kushtet e Përdorimit" : "Terms"}
</a>
      </div>
    </footer>
  );
}