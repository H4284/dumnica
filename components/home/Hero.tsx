import Image from "next/image";
import Link from "next/link";
import type { HomePageQueryResult } from "@/sanity.types";

type HeroProps = {
  homePage: HomePageQueryResult;
};

export default function Hero({ homePage }: HeroProps) {
  if (!homePage) return null;

  const imageUrl = homePage.heroImage?.asset?.url;

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

      {homePage.heroButtonText && homePage.heroButtonLink && (
        <Link href={homePage.heroButtonLink}>
          {homePage.heroButtonText}
        </Link>
      )}
    </section>
  );
}