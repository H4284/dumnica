import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <h2>Faqja nuk u gjet</h2>

      <p>
        Na vjen keq, por faqja që po kërkon nuk ekziston.
      </p>

      <div>
        <Link href="/projects">Projects</Link>
        <Link href="/afarizmi">Afarizmi</Link>
      </div>
    </main>
  );
}