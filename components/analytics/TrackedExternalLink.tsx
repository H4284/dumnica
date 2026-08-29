"use client";

import { trackSiteEvent, type SiteEvent } from "@/components/analytics/trackEvent";

type TrackedExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: SiteEvent;
};

export default function TrackedExternalLink({
  event,
  onClick,
  children,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      onClick={(clickEvent) => {
        trackSiteEvent(event);
        onClick?.(clickEvent);
      }}
    >
      {children}
    </a>
  );
}
