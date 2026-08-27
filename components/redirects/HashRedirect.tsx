"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const hashMap: Record<string, string> = {
  "#/": "/en",
  "#/afarizmi/A1": "/en/afarizmi",
  "#/projects": "/en/projects",
  "#/afarizmi/page/99":
    "/en/afarizmi/dumnica-residence?njesia=A-3-12",
};

export default function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;

    console.log("Old hash:", hash);

    const target = hashMap[hash];

    if (target) {
      console.log("Redirecting to:", target);
      router.replace(target);
    }
  }, [router]);

  return null;
}