import type { SiteSettingsQueryResult } from "@/sanity.types";

type FooterProps = {
  siteSettings: SiteSettingsQueryResult;
};

export default function Footer({ siteSettings }: FooterProps) {
    return (
      <footer>
        <div>
          <div>
            <h2>Dumnica</h2>
            {siteSettings?.phone && (
            <p>Phone: {siteSettings.phone}</p>
          )}

          {siteSettings?.email && (
            <p>Email: {siteSettings.email}</p>
          )}

          {siteSettings?.address && (
            <p>Address: {siteSettings.address}</p>
          )}
          </div>
  
          <nav>
            <a href="/afarizmi">Afarizmi</a>
            <a href="/projects">Projects</a>
          </nav>
  
          <div>
          {siteSettings?.socialLinks?.instagram && (
            <a href={siteSettings.socialLinks.instagram}>
              Instagram
            </a>
          )}

          {siteSettings?.socialLinks?.facebook && (
            <a href={siteSettings.socialLinks.facebook}>
              Facebook
            </a>
          )}

          {siteSettings?.socialLinks?.linkedin && (
            <a href={siteSettings.socialLinks.linkedin}>
              LinkedIn
            </a>
          )}
          </div>
        </div>
  
        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    );
  }