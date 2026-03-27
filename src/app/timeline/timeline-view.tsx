"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EraTabs } from "@/components/timeline/era-tabs";
import { TimelineCard } from "@/components/timeline/timeline-card";

interface Scene {
  slug: string;
  title: string;
  subtitle: string | null;
  dateApprox: string | null;
  convergenceScore: number;
  gospels: string[];
  locationLabel: string | null;
}

interface Act {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  timeRange: string;
  description: string | null;
  scenes: Scene[];
}

interface TimelineViewProps {
  acts: Act[];
}

export function TimelineView({ acts }: TimelineViewProps) {
  const [selectedAct, setSelectedAct] = useState<number | null>(null);

  const filteredActs = selectedAct
    ? acts.filter((a) => a.number === selectedAct)
    : acts;

  return (
    <div>
      <EraTabs
        acts={acts.map((a) => ({
          number: a.number,
          slug: a.slug,
          title: a.title,
          subtitle: a.subtitle,
          sceneCount: a.scenes.length,
        }))}
        selectedAct={selectedAct}
        onSelect={setSelectedAct}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedAct ?? "all"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-8 space-y-10"
        >
          {filteredActs.map((act) => (
            <section key={act.slug}>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-ui text-xs px-2 py-0.5 rounded-full bg-[rgb(var(--gold)/.1)] text-gold">
                  Act {act.number}
                </span>
                <h2 className="font-heading text-lg text-parchment">
                  {act.title}
                </h2>
              </div>
              <p className="text-dim text-sm font-body mb-1">{act.subtitle} — {act.timeRange}</p>
              {act.description && (
                <p className="text-dim text-xs font-body mb-4">{act.description}</p>
              )}

              {act.scenes.length === 0 ? (
                <p className="text-dim text-sm italic font-body">
                  Scenes coming soon...
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {act.scenes.map((scene, i) => (
                    <TimelineCard key={scene.slug} index={i} {...scene} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </motion.div>
      </AnimatePresence>

      {acts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-dim text-lg font-body">
            No data yet. Run{" "}
            <code className="font-ui text-sm bg-surface px-2 py-1 rounded">
              npm run db:seed
            </code>{" "}
            to populate.
          </p>
        </div>
      )}
    </div>
  );
}
