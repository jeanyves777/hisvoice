"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingModeProps {
  title: string;
  accounts: { gospel: string; reference: string; text: string }[];
  jesusWords: { text: string; reference: string; note?: string | null }[];
}

export function ReadingModeToggle({ title, accounts, jesusWords }: ReadingModeProps) {
  const [active, setActive] = useState(false);

  return (
    <>
      <button
        onClick={() => setActive(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-ui text-xs text-dim border hover:border-[rgb(var(--gold))] hover:text-gold transition-colors"
        title="Distraction-free reading"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Read
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[rgb(var(--bg-primary))] overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto px-6 py-12">
              {/* Close button */}
              <button
                onClick={() => setActive(false)}
                className="fixed top-6 right-6 p-2 rounded-full bg-surface border text-dim hover:text-gold transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h1 className="font-heading text-2xl text-parchment mb-8 text-center">{title}</h1>

              {/* Gospel text */}
              {accounts.map((acc, i) => (
                <div key={i} className="mb-8">
                  <p className="font-ui text-xs text-dim mb-2 uppercase tracking-wider">
                    {acc.gospel} — {acc.reference}
                  </p>
                  <p className="font-body text-lg leading-loose">{acc.text}</p>
                </div>
              ))}

              {/* Jesus words */}
              {jesusWords.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <p className="font-heading text-sm text-gold mb-6 text-center">Words of Jesus</p>
                  {jesusWords.map((w, i) => (
                    <blockquote key={i} className="mb-6 text-center">
                      <p className="jesus-words text-xl leading-relaxed">
                        &ldquo;{w.text}&rdquo;
                      </p>
                      <cite className="block text-sm text-dim font-ui mt-2 not-italic">
                        — {w.reference}
                      </cite>
                    </blockquote>
                  ))}
                </div>
              )}

              <p className="text-center text-dim font-ui text-xs mt-12">
                Press Escape or click × to exit reading mode
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
