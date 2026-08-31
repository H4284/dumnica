import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="page-shell">
      <div className="site-container pb-24 pt-10">
        <h1 className="page-title">{t("title")}</h1>
        <h2 className="mt-4 text-xl">{t("heading")}</h2>
        <p className="page-lede">{t("body")}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects" className="btn btn-primary">
            {t("projects")}
          </Link>
          <Link href="/afarizmi" className="btn btn-ghost">
            {t("afarizmi")}
          </Link>
        </div>
      </div>
    </div>
  );
}
