"use client";

import { useEffect } from "react";

import { trackSiteEvent, type SiteEvent } from "@/components/analytics/trackEvent";
import { useConsent } from "@/components/analytics/ConsentProvider";

export default function PageEvent({ event }: { event: SiteEvent }) {
  const { consent } = useConsent();

  useEffect(() => {
    if (consent === "accepted") {
      trackSiteEvent(event);
    }
  }, [consent, event]);

  return null;
}
