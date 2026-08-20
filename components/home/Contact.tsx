import type { SiteSettingsQueryResult } from "@/sanity.types";

type ContactProps = {
  siteSettings: NonNullable<SiteSettingsQueryResult>;
};

export default function Contact({ siteSettings }: ContactProps) {
  return (
    <section>
      <h2>Contact</h2>

      {siteSettings.phone && (
        <p>
          Phone: <a href={`tel:${siteSettings.phone}`}>{siteSettings.phone}</a>
        </p>
      )}

      {siteSettings.email && (
        <p>
          Email:{" "}
          <a href={`mailto:${siteSettings.email}`}>
            {siteSettings.email}
          </a>
        </p>
      )}

      {siteSettings.address && <p>Address: {siteSettings.address}</p>}

      {siteSettings.whatsapp && (
  <p>
    WhatsApp:{" "}
    <a
      href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      WhatsApp
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