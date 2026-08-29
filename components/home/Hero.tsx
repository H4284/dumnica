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
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={homePage.heroTitle || "Dumnica"}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <h1>{homePage.heroTitle || "Dumnica"}</h1>

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
