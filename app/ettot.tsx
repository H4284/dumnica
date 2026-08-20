"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <h1>Diçka shkoi keq</h1>

      <p>
        Na vjen keq, ndodhi një problem gjatë ngarkimit të faqes.
      </p>

      <button type="button" onClick={() => reset()}>
        Provo përsëri
      </button>
    </main>
  );
}