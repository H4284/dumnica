import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ConsentProvider } from "@/components/analytics/ConsentProvider";
import CookieBanner from "@/components/analytics/CookieBanner";
import TrackingScripts from "@/components/analytics/TrackingScripts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteSettings } from "@/sanity/lib/client";
import { routing, type AppLocale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin-ext"],
  display: "swap",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  return {
    metadataBase: new URL(getSiteUrl()),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale as AppLocale);

  const [messages, siteSettings, t] = await Promise.all([
    getMessages(),
    getSiteSettings(),
    getTranslations("common"),
  ]);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <ConsentProvider>
            <a href="#main-content" className="skip-link">
              {t("skipToContent")}
            </a>

            <Header siteSettings={siteSettings} />

            <NuqsAdapter>
              <main id="main-content">{children}</main>
            </NuqsAdapter>

            <Footer siteSettings={siteSettings} />
            <CookieBanner />
            <TrackingScripts />
            <SpeedInsights />
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
