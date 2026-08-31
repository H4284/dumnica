import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing, type AppLocale, formatDate } from "@/i18n/routing";
import { listLeadBackup } from "@/lib/leadBackup";

const REPORT_COOKIE = "dumnica_report";

type ReportPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

function reportPath(locale: string, error?: boolean) {
  const path =
    locale === routing.defaultLocale ? "/report" : `/${locale}/report`;
  return error ? `${path}?error=1` : path;
}

async function unlockReport(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const locale = String(formData.get("locale") ?? routing.defaultLocale);
  const expected = process.env.REPORT_PASSWORD?.trim();

  if (!expected || password !== expected) {
    redirect(reportPath(locale, true));
  }

  const cookieStore = await cookies();
  cookieStore.set(REPORT_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(reportPath(locale));
}

export default async function ReportPage({
  params,
  searchParams,
}: ReportPageProps) {
  const { locale } = await params;
  const { error } = await searchParams;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("report");
  const cookieStore = await cookies();
  const unlocked = cookieStore.get(REPORT_COOKIE)?.value === "1";
  const sheetUrl = process.env.GOOGLE_SHEETS_VIEW_URL?.trim();

  if (!unlocked) {
    return (
      <div className="page-shell">
        <div className="site-container max-w-md pb-20">
          <h1 className="page-title mb-4">{t("title")}</h1>
          <p className="mb-6 text-sm text-secondary">{t("lockHint")}</p>
          {error && (
            <p role="alert" className="mb-4 text-sm text-danger">
              {t("wrongPassword")}
            </p>
          )}
          <form action={unlockReport} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <label htmlFor="report-password" className="block text-sm">
              {t("password")}
            </label>
            <input
              id="report-password"
              name="password"
              type="password"
              required
              className="field-input"
            />
            <button type="submit" className="btn btn-primary">
              {t("unlock")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const rows = await listLeadBackup();
  const monthly = new Map<string, number>();

  for (const row of rows) {
    const month = row.created ? row.created.slice(0, 7) : t("unknownMonth");
    monthly.set(month, (monthly.get(month) ?? 0) + 1);
  }

  return (
    <div className="page-shell">
      <div className="site-container pb-20">
        <h1 className="page-title mb-2">{t("title")}</h1>
        <p className="page-lede mb-8">{t("intro")}</p>

      {sheetUrl && (
        <p className="mb-6">
          <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
            {t("openSheet")}
          </a>
        </p>
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">{t("byMonth")}</h2>
        {monthly.size === 0 ? (
          <p>{t("empty")}</p>
        ) : (
          <ul className="space-y-1">
            {[...monthly.entries()].map(([month, count]) => (
              <li key={month}>
                {month}: {count}
              </li>
            ))}
          </ul>
        )}
      </section>

      {rows.length > 0 && (
        <section className="overflow-x-auto">
          <h2 className="mb-3 text-xl font-semibold">{t("recent")}</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th className="py-2">{t("date")}</th>
                <th>{t("name")}</th>
                <th>{t("phone")}</th>
                <th>{t("project")}</th>
                <th>{t("source")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((row, index) => (
                <tr key={`${row.phone}-${index}`}>
                  <td className="py-2">
                    {row.created ? formatDate(row.created, locale) : "—"}
                  </td>
                  <td>{row.name}</td>
                  <td>{row.phone}</td>
                  <td>{row.project}</td>
                  <td>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      </div>
    </div>
  );
}
