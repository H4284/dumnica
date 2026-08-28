import Image from "next/image";

import type { HomePageQueryResult } from "@/sanity.types";
import { Link } from "@/i18n/navigation";
import { toLocalePath } from "@/lib/toLocalePath";

type HeroProps = {
  homePage: HomePageQueryResult;
};

export default function Hero({ homePage }: HeroProps) {
  if (!homePage) return null;

  const imageUrl = homePage.heroImage?.asset?.url;
  const buttonLink = homePage.heroButtonLink
    ? toLocalePath(homePage.heroButtonLink)
    : homePage.heroButtonLink;
  const isExternal =
    Boolean(buttonLink) &&
    (buttonLink!.startsWith("http://") || buttonLink!.startsWith("https://"));

  return (
    <section>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={homePage.heroTitle || "Dumnica"}
          width={1600}
          height={900}
          priority
          sizes="100vw"
        />
      )}

      {homePage.heroTitle && <h1>{homePage.heroTitle}</h1>}

      {homePage.heroButtonText && buttonLink && (
        isExternal ? (
          <a href={buttonLink}>{homePage.heroButtonText}</a>
        ) : (
          <Link href={buttonLink}>{homePage.heroButtonText}</Link>
        )
      )}
    </section>
  );
}
