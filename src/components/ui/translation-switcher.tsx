"use client";

import { useAppStore } from "@/store/app-store";

const TRANSLATIONS = [
  { key: "kjv" as const, label: "KJV", full: "King James Version" },
  { key: "web" as const, label: "WEB", full: "World English Bible" },
  { key: "asv" as const, label: "ASV", full: "American Standard Version" },
];

export function TranslationSwitcher() {
  const { selectedTranslation, setTranslation } = useAppStore();

  return (
    <div className="flex items-center gap-1 font-ui text-sm">
      {TRANSLATIONS.map((t) => (
        <button
          key={t.key}
          onClick={() => setTranslation(t.key)}
          title={t.full}
          className={`px-2.5 py-1 rounded transition-colors ${
            selectedTranslation === t.key
              ? "bg-[rgb(var(--gold))] text-white"
              : "text-dim hover:text-[rgb(var(--text-body))] hover:bg-surface"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
