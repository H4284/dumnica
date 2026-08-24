"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Sheet({
  open,
  onClose,
  title,
  children,
}: SheetProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
      className="fixed inset-0 z-50"
    >
      <button
        type="button"
        aria-label="Close sheet"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2
            id="sheet-title"
            className="text-xl font-semibold text-primary"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="rounded-md px-3 py-1 text-xl text-secondary transition-colors duration-200 hover:bg-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}