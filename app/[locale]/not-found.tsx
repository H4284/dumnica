import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main>
      <h1>{t("title")}</h1>
      <h2>{t("heading")}</h2>
      <p>{t("body")}</p>

      <div>
        <Link href="/projects">{t("projects")}</Link>
        <Link href="/afarizmi">{t("afarizmi")}</Link>
      </div>
    </main>
  );
}
