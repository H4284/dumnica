import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="sq">
      <body>
        <main>
          <h1>404</h1>
          <p>
            <Link href="/">Dumnica</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
