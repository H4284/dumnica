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
    <section className="hero">
      {imageUrl && (
        <div className="hero-media">
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
      <div className="hero-overlay" />
      <div className="site-container hero-content">
        <h1 className="hero-title">{homePage.heroTitle || "Dumnica"}</h1>
        {homePage.heroButtonText && buttonLink && (
          isExternal ? (
            <a href={buttonLink} className="btn btn-primary mt-8">
              {homePage.heroButtonText}
            </a>
          ) : (
            <Link href={buttonLink} className="btn btn-primary mt-8">
              {homePage.heroButtonText}
            </Link>
          )
        )}
      </div>
    </section>
  );
}
