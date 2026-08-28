import { getLocale, getTranslations } from "next-intl/server";

import type { SiteSettingsQueryResult } from "@/sanity.types";
import { Link } from "@/i18n/navigation";

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
    <footer>
      <div>
        <div>
          <h2>{tCommon("brand")}</h2>

          {siteSettings?.phone && (
            <p>
              {t("phone")}: {siteSettings.phone}
            </p>
          )}

          {siteSettings?.email && (
            <p>
              {t("email")}: {siteSettings.email}
            </p>
          )}

          {siteSettings?.address && (
            <p>
              {t("address")}: {siteSettings.address}
            </p>
          )}
        </div>

        <nav>
          <Link href="/afarizmi">{tNav("afarizmi")}</Link>
          <Link href="/projects">{tNav("projects")}</Link>
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
        <Link href={`/${privacySlug}`}>{t("privacy")}</Link>
        <Link href={`/${termsSlug}`}>{t("terms")}</Link>
      </div>
    </footer>
  );
}
