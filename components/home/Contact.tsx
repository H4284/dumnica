import { getTranslations } from "next-intl/server";

import type { SiteSettingsQueryResult } from "@/sanity.types";

type ContactProps = {
  siteSettings: NonNullable<SiteSettingsQueryResult>;
};

export default async function Contact({ siteSettings }: ContactProps) {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <section>
      <h2>{t("contact")}</h2>

      {siteSettings.phone && (
        <p>
          {t("phone")}:{" "}
          <a href={`tel:${siteSettings.phone}`}>{siteSettings.phone}</a>
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

      {siteSettings.whatsapp && (
        <p>
          {tCommon("whatsapp")}:{" "}
          <a
            href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tCommon("whatsapp")}
          </a>
        </p>
      )}

      {siteSettings.socialLinks?.instagram && (
        <a
          href={siteSettings.socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
      )}

      {siteSettings.socialLinks?.facebook && (
        <a
          href={siteSettings.socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
      )}

      {siteSettings.socialLinks?.linkedin && (
        <a
          href={siteSettings.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      )}
    </section>
  );
}
