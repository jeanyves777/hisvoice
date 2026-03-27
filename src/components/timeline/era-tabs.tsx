"use client";

import { motion } from "framer-motion";

interface Act {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  sceneCount: number;
}

interface EraTabsProps {
  acts: Act[];
  selectedAct: number | null;
  onSelect: (actNumber: number | null) => void;
}

export function EraTabs({ acts, selectedAct, onSelect }: EraTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 text-xs font-ui rounded-full transition-colors ${
          selectedAct === null
            ? "bg-[rgb(var(--gold))] text-white"
            : "text-dim hover:text-[rgb(var(--text-body))] border hover:border-[rgb(var(--gold))]"
        }`}
      >
        All Acts
      </button>
      {acts.map((act) => (
        <button
          key={act.number}
          onClick={() => onSelect(act.number)}
          className={`px-3 py-1.5 text-xs font-ui rounded-full transition-colors relative ${
            selectedAct === act.number
              ? "bg-[rgb(var(--gold))] text-white"
              : "text-dim hover:text-[rgb(var(--text-body))] border hover:border-[rgb(var(--gold))]"
          }`}
        >
          {selectedAct === act.number && (
            <motion.div
              layoutId="active-era"
              className="absolute inset-0 bg-[rgb(var(--gold))] rounded-full -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative">
            {act.number}. {act.title}
          </span>
          <span className="ml-1 opacity-60">({act.sceneCount})</span>
        </button>
      ))}
    </div>
  );
}
