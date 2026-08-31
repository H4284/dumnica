import { getLocale, getTranslations } from "next-intl/server";

import type { SiteSettingsQueryResult } from "@/sanity.types";
import { Link } from "@/i18n/navigation";
import TrackedExternalLink from "@/components/analytics/TrackedExternalLink";

type FooterProps = {
  siteSettings: SiteSettingsQueryResult;
};

export default async function Footer({ siteSettings }: FooterProps) {
  const t = await getTranslations("footer");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const locale = await getLocale();

  const privacySlug =
    locale === "sq" ? "politika-e-privatesise" : "privacy-policy";
  const termsSlug = locale === "sq" ? "kushtet-e-perdorimit" : "terms";

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div>
            <p className="site-logo">{tCommon("brand")}</p>
            {siteSettings?.address && (
              <p className="mt-4 max-w-sm text-sm text-dark-muted">
                {siteSettings.address}
              </p>
            )}
          </div>

          <nav className="flex flex-col gap-3 text-sm">
            <Link href="/afarizmi">{tNav("afarizmi")}</Link>
            <Link href="/projects">{tNav("projects")}</Link>
            <Link href="/kontakti">{tNav("contact")}</Link>
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            {siteSettings?.phone && (
              <TrackedExternalLink
                event="phone_click"
                href={`tel:${siteSettings.phone}`}
              >
                {siteSettings.phone}
              </TrackedExternalLink>
            )}
            {siteSettings?.email && (
              <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
            )}
            {siteSettings?.whatsapp && (
              <TrackedExternalLink
                event="whatsapp_click"
                href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
                className="btn btn-whatsapp mt-2 w-fit"
              >
                {tCommon("whatsapp")}
              </TrackedExternalLink>
            )}
            <div className="mt-2 flex gap-4 text-sm">
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
        </div>

        <div className="footer-legal">
          <Link href={`/${privacySlug}`}>{t("privacy")}</Link>
          <Link href={`/${termsSlug}`}>{t("terms")}</Link>
        </div>
      </div>
    </footer>
  );
}
