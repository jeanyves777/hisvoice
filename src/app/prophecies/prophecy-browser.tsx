"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Fulfillment {
  sceneSlug: string;
  sceneTitle: string;
  sceneDateApprox: string | null;
  convergenceScore: number;
  note: string | null;
}

interface Prophecy {
  slug: string;
  label: string;
  reference: string;
  dateWritten: string | null;
  textKjv: string;
  fulfillmentType: string | null;
  probabilityNote: string | null;
  fulfillments: Fulfillment[];
}

type FilterType = "all" | "direct" | "typological" | "allusion";

export function ProphecyBrowser({ prophecies }: { prophecies: Prophecy[] }) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? prophecies
      : prophecies.filter((p) => p.fulfillmentType === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 justify-center mb-6">
        {(["all", "direct", "typological", "allusion"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-ui rounded-full capitalize transition-colors ${
              filter === f
                ? "bg-[rgb(var(--prophecy))] text-white"
                : "text-dim border hover:border-[rgb(var(--prophecy))]"
            }`}
          >
            {f === "all" ? `All (${prophecies.length})` : f}
          </button>
        ))}
      </div>

      {/* Prophecy list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <div
                className={`bg-surface rounded-lg border transition-all overflow-hidden ${
                  expanded === p.slug
                    ? "border-[rgb(var(--prophecy))] shadow-lg"
                    : "hover:border-[rgb(var(--prophecy)/.5)]"
                }`}
              >
                {/* Header — clickable to expand */}
                <button
                  onClick={() => setExpanded(expanded === p.slug ? null : p.slug)}
                  className="w-full text-left p-4 flex items-start gap-4"
                >
                  {/* Thread line */}
                  <div className="flex flex-col items-center shrink-0 pt-1">
                    <div className="w-3 h-3 rounded-full bg-[rgb(var(--prophecy))]" />
                    {p.fulfillments.length > 0 && (
                      <div className="w-0.5 h-8 bg-gradient-to-b from-[rgb(var(--prophecy))] to-[rgb(var(--gold))]" />
                    )}
                    {p.fulfillments.length > 0 && (
                      <div className="w-3 h-3 rounded-full bg-[rgb(var(--gold))]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-sm text-parchment">
                        {p.label}
                      </h3>
                      {p.fulfillmentType && (
                        <span className="shrink-0 text-xs font-ui px-2 py-0.5 rounded bg-[rgb(var(--prophecy)/.1)] text-prophecy">
                          {p.fulfillmentType}
                        </span>
                      )}
                    </div>
                    <p className="font-ui text-xs text-dim mt-0.5">
                      {p.reference} — {p.dateWritten}
                    </p>
                    {p.fulfillments.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-ui text-gold">
                          Fulfilled in: {p.fulfillments.map((f) => f.sceneTitle).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-dim text-xs shrink-0">
                    {expanded === p.slug ? "−" : "+"}
                  </span>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {expanded === p.slug && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t">
                        {/* OT Text */}
                        <div className="mt-4 p-4 rounded-lg bg-[rgb(var(--prophecy)/.05)] border border-[rgb(var(--prophecy)/.15)]">
                          <p className="font-ui text-xs text-prophecy mb-2">
                            Original Prophecy (KJV)
                          </p>
                          <blockquote className="font-body text-sm italic leading-relaxed">
                            &ldquo;{p.textKjv}&rdquo;
                          </blockquote>
                          <p className="font-ui text-xs text-dim mt-2">
                            {p.reference}
                          </p>
                        </div>

                        {p.probabilityNote && (
                          <p className="text-xs font-ui text-gold mt-3">
                            Probability: {p.probabilityNote}
                          </p>
                        )}

                        {/* Fulfillment links */}
                        {p.fulfillments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="font-ui text-xs text-gold">
                              Fulfilled In:
                            </p>
                            {p.fulfillments.map((f) => (
                              <Link
                                key={f.sceneSlug}
                                href={`/scene/${f.sceneSlug}`}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--gold)/.05)] border border-[rgb(var(--gold)/.15)] hover:border-[rgb(var(--gold))] transition-colors"
                              >
                                <div className="w-2 h-2 rounded-full bg-[rgb(var(--gold))]" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-heading text-xs text-parchment">
                                    {f.sceneTitle}
                                  </p>
                                  {f.sceneDateApprox && (
                                    <p className="text-xs font-ui text-dim">
                                      {f.sceneDateApprox}
                                    </p>
                                  )}
                                  {f.note && (
                                    <p className="text-xs font-body text-dim mt-0.5">
                                      {f.note}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        <Link
                          href={`/prophecies/${p.slug}`}
                          className="inline-block mt-3 text-xs font-ui text-gold hover:underline"
                        >
                          View full prophecy details →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
