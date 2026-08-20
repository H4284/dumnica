import type { HomePageQueryResult } from "@/sanity.types";

type AboutProps = {
  homePage: NonNullable<HomePageQueryResult>;
};

export default function About({ homePage }: AboutProps) {
  return (
    <section>
      <div>
        <h2>{homePage.aboutTitle}</h2>

        {homePage.aboutText && <p>{homePage.aboutText}</p>}
      </div>

      {homePage.aboutImage?.asset?.url && (
        <img
          src={homePage.aboutImage.asset.url}
          alt={homePage.aboutTitle || "About Dumnica"}
        />
      )}
    </section>
  );
}