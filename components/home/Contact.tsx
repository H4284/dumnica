import { getTranslations } from "next-intl/server";

import type { SiteSettingsQueryResult } from "@/sanity.types";
import TrackedExternalLink from "@/components/analytics/TrackedExternalLink";
import { Link } from "@/i18n/navigation";

type ContactProps = {
  siteSettings: NonNullable<SiteSettingsQueryResult>;
};

export default async function Contact({ siteSettings }: ContactProps) {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");

  return (
    <section className="contact-cta section">
      <div className="site-container contact-cta-grid">
        <div>
          <p className="section-kicker">{t("contact")}</p>
          <h2 className="section-title">{t("contact")}</h2>
          <div className="mt-6 space-y-2 text-secondary">
            {siteSettings.phone && (
              <p>
                {t("phone")}:{" "}
                <TrackedExternalLink
                  event="phone_click"
                  href={`tel:${siteSettings.phone}`}
                >
                  {siteSettings.phone}
                </TrackedExternalLink>
              </p>
            )}
            {siteSettings.email && (
              <p>
                {t("email")}:{" "}
                <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
              </p>
            )}
            {siteSettings.address && (
              <p>
                {t("address")}: {siteSettings.address}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/kontakti" className="btn btn-primary">
            {tNav("contact")}
          </Link>
          {siteSettings.whatsapp && (
            <TrackedExternalLink
              event="whatsapp_click"
              href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              {tCommon("whatsapp")}
            </TrackedExternalLink>
          )}
        </div>
      </div>
    </section>
  );
}
