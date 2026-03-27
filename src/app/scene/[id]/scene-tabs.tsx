"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/app-store";
import { TranslationSwitcher } from "@/components/ui/translation-switcher";
import { GospelTag } from "@/components/ui/gospel-tag";
import Link from "next/link";

interface AccountData {
  id: string;
  gospel: string;
  reference: string;
  translations: { version: string; text: string }[];
}

interface JesusWordData {
  text: string;
  reference: string;
  note: string | null;
}

interface SourceParallelData {
  sourceTitle: string;
  sourceType: string | null;
  categorySlug: string;
  sourceSlug: string;
  note: string | null;
}

interface SceneTabsProps {
  accounts: AccountData[];
  jesusWords: JesusWordData[];
  gapNotes: string[];
  sourceParallels: SourceParallelData[];
}

const TABS = [
  { key: "harmony", label: "Gospel Harmony" },
  { key: "words", label: "Words of Jesus" },
  { key: "gaps", label: "Gap Analysis" },
  { key: "sources", label: "External Sources" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function SceneTabs({
  accounts,
  jesusWords,
  gapNotes,
  sourceParallels,
}: SceneTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("harmony");
  const { selectedTranslation } = useAppStore();

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b mb-6 flex-wrap gap-2">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2 text-sm font-ui transition-colors ${
                activeTab === tab.key
                  ? "text-gold"
                  : "text-dim hover:text-[rgb(var(--text-body))]"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="scene-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(var(--gold))]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        {activeTab === "harmony" && <TranslationSwitcher />}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "harmony" && (
            <HarmonyTab accounts={accounts} translation={selectedTranslation} />
          )}
          {activeTab === "words" && <WordsTab words={jesusWords} />}
          {activeTab === "gaps" && <GapsTab notes={gapNotes} />}
          {activeTab === "sources" && <SourcesTab sources={sourceParallels} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HarmonyTab({
  accounts,
  translation,
}: {
  accounts: AccountData[];
  translation: string;
}) {
  if (accounts.length === 0) {
    return <p className="text-dim font-body italic">No gospel accounts recorded for this scene.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {accounts.map((account) => {
        const text = account.translations.find((t) => t.version === translation)?.text;
        return (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-5 bg-surface rounded-lg border-l-4 border-[rgb(var(--border))]"
            style={{
              borderLeftColor: `rgb(var(--${account.gospel}))`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <GospelTag gospel={account.gospel} />
              <span className="font-ui text-xs text-dim">{account.reference}</span>
            </div>
            {text ? (
              <p className="font-body text-sm leading-relaxed">{text}</p>
            ) : (
              <p className="text-dim text-sm italic font-body">
                Text not yet imported for {translation.toUpperCase()}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function WordsTab({ words }: { words: JesusWordData[] }) {
  if (words.length === 0) {
    return <p className="text-dim font-body italic">No recorded words of Jesus in this scene.</p>;
  }

  return (
    <div className="space-y-6">
      {words.map((word, i) => (
        <blockquote
          key={i}
          className="border-l-4 border-[rgb(var(--gold-bright))] pl-5 py-2"
        >
          <p className="jesus-words text-lg leading-relaxed">
            &ldquo;{word.text}&rdquo;
          </p>
          <cite className="block text-sm text-dim font-ui mt-2 not-italic">
            {word.reference}
            {word.note && <span className="ml-2">— {word.note}</span>}
          </cite>
        </blockquote>
      ))}
    </div>
  );
}

function GapsTab({ notes }: { notes: string[] }) {
  if (notes.length === 0) {
    return <p className="text-dim font-body italic">No gap analysis notes for this scene.</p>;
  }

  return (
    <div>
      <p className="text-dim font-ui text-sm mb-4">
        What each gospel adds, omits, or uniquely preserves:
      </p>
      <ul className="space-y-3">
        {notes.map((note, i) => (
          <li key={i} className="flex gap-3 text-sm font-body">
            <span className="text-gold font-ui font-semibold shrink-0">{i + 1}.</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourcesTab({ sources }: { sources: SourceParallelData[] }) {
  if (sources.length === 0) {
    return <p className="text-dim font-body italic">No external sources linked to this scene.</p>;
  }

  return (
    <div className="space-y-3">
      {sources.map((src, i) => (
        <div key={i} className="p-4 bg-surface rounded-lg border">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/sources/${src.categorySlug}/${src.sourceSlug}`}
              className="font-ui text-sm text-john hover:underline font-semibold"
            >
              {src.sourceTitle}
            </Link>
            {src.sourceType && (
              <span className="font-ui text-xs text-dim">{src.sourceType}</span>
            )}
          </div>
          {src.note && (
            <p className="text-sm text-dim font-body">{src.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}
