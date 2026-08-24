"use client";

import { useState } from "react";

type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
};

export default function Accordion({ items }: AccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  if (!items.length) {
    return null;
  }

  const toggleItem = (id: string) => {
    setOpenItem((current) => (current === id ? null : id));
  };

  return (
    <div className="w-full divide-y divide-border border-y border-border">
      {items.map((item) => {
        const isOpen = openItem === item.id;

        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${item.id}-content`}
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-primary transition-colors duration-200 hover:text-secondary focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="font-medium">{item.title}</span>

              <span
                aria-hidden="true"
                className={`text-xl transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            {isOpen && (
              <div
                id={`${item.id}-content`}
                className="pb-4 text-secondary"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}