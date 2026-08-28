"use client";

import { useEffect } from "react";

import { useRouter } from "@/i18n/navigation";

const hashMap: Record<string, string> = {
  "#/": "/",
  "#/afarizmi/A1": "/afarizmi",
  "#/projects": "/projects",
  "#/afarizmi/page/99": "/afarizmi/dumnica-residence?njesia=A-3-12",
};

export default function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const target = hashMap[hash];

    if (!target) {
      return;
    }

    const [pathname, query] = target.split("?");
    router.replace(
      query ? `${pathname}?${query}` : pathname,
    );
  }, [router]);

  return null;
}
