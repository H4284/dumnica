import type { HomePageQueryResult } from "@/sanity.types";

type NumbersProps = {
  homePage: NonNullable<HomePageQueryResult>;
};

export default function Numbers({ homePage }: NumbersProps) {
  return (
    <section>
      <div>
        <strong>{homePage.yearsOfExperience}</strong>
        <span>Years of Experience</span>
      </div>

      <div>
        <strong>{homePage.finishedProjects}</strong>
        <span>Finished Projects</span>
      </div>

      <div>
        <strong>{homePage.apartmentsDelivered}</strong>
        <span>Apartments Delivered</span>
      </div>
    </section>
  );
}