import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/sanity/lib/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Analytics } from "@vercel/analytics/react";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const siteSettings = await getSiteSettings();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <Header siteSettings={siteSettings} locale={locale} />

      <NuqsAdapter>
        <main id="main-content">{children}</main>
      </NuqsAdapter>

      <Footer siteSettings={siteSettings} locale={locale} />
      
      <Analytics />
    </>
  );
}