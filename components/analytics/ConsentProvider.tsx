"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import {
  CONSENT_COOKIE,
  type ConsentValue,
} from "@/components/analytics/trackEvent";

type ConsentContextValue = {
  consent: ConsentValue | null;
  ready: boolean;
  accept: () => void;
  reject: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readConsent(): ConsentValue | null {
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));

  const value = match?.split("=")[1];
  if (value === "accepted" || value === "rejected") {
    return value;
  }

  return null;
}

function writeConsent(value: ConsentValue) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

const emptySubscribe = () => () => {};

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const ready = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [override, setOverride] = useState<ConsentValue | null>(null);
  const cookieConsent = ready ? readConsent() : null;
  const consent = override ?? cookieConsent;

  const accept = useCallback(() => {
    writeConsent("accepted");
    setOverride("accepted");
  }, []);

  const reject = useCallback(() => {
    writeConsent("rejected");
    setOverride("rejected");
  }, []);

  const value = useMemo(
    () => ({ consent, ready, accept, reject }),
    [accept, consent, ready, reject],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return context;
}
