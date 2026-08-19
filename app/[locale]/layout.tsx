import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/sanity/lib/client";

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  console.log("SITE SETTINGS:", siteSettings);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <Header siteSettings={siteSettings} />

      <main id="main-content">{children}</main>

      <Footer siteSettings={siteSettings} />
    </>
  );
}