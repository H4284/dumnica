"use client";

import { useState } from "react";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  if (!tabs.length) {
    return null;
  }

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="Content sections"
        className="flex gap-2 border-b border-border"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-secondary hover:border-border hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) =>
        activeTab === tab.id ? (
          <div
            key={tab.id}
            id={`${tab.id}-panel`}
            role="tabpanel"
            className="py-6"
          >
            {tab.content}
          </div>
        ) : null,
      )}
    </div>
  );
}