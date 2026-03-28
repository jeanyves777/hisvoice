"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface DataStats {
  scenes: number;
  prophecies: number;
  sources: number;
  studies: number;
  archaeology: number;
}

// Pre-built evidence cards for common questions (until VPS AI is ready)
const EVIDENCE_LIBRARY: Record<string, { cards: EvidenceCard[]; synthesis: string }> = {
  "Did Jesus really exist?": {
    cards: [
      { tradition: "Roman", color: "#D4826B", title: "Tacitus — Annals XV.44 (116 AD)", text: "'Christus, from whom the name had its origin, suffered the extreme penalty during the reign of Tiberius at the hands of Pontius Pilatus.' A Roman senator with no sympathy for Christians confirms the basic facts.", type: "hostile" },
      { tradition: "Jewish", color: "#5B8FD4", title: "Josephus — Antiquities 20.9.1 (94 AD)", text: "'The brother of Jesus, who was called Christ, whose name was James.' A Jewish historian working for Rome independently confirms Jesus existed and had a brother.", type: "hostile" },
      { tradition: "Jewish", color: "#5B8FD4", title: "Talmud — Sanhedrin 43a (200-500 AD)", text: "'On Passover eve Yeshu was hanged. He practiced sorcery and enticed Israel.' The people who wanted Jesus dead CONFIRM he existed and did extraordinary things.", type: "hostile" },
      { tradition: "Islamic", color: "#6BAE84", title: "Quran — 25 Chapters, 93+ Verses", text: "600 years later, an entirely separate religion confirms Jesus existed, was born of a virgin, performed miracles, had disciples, and ascended to heaven.", type: "independent" },
      { tradition: "Greek", color: "#D4826B", title: "Pliny the Younger — Letter X.96 (112 AD)", text: "'They sing hymns to Christ as to a god.' Within 80 years, a Roman governor reports Christians worshipping Jesus throughout his province.", type: "hostile" },
    ],
    synthesis: "Jesus's existence is confirmed by 10 independent traditions spanning 3,000 years. Even hostile witnesses — people who opposed him — confirm he lived, had followers, and did extraordinary things. No serious historian disputes his existence.",
  },
  "Did Jesus actually die on the cross?": {
    cards: [
      { tradition: "Gospels", color: "#C9A96E", title: "All 4 Gospels — Convergence 4/4", text: "Matthew, Mark, Luke, and John all independently record the crucifixion with different details — confirming the same event from multiple eyewitness perspectives.", type: "primary" },
      { tradition: "Roman", color: "#D4826B", title: "Tacitus — 'Extreme Penalty' (116 AD)", text: "The Roman historian confirms Jesus 'suffered the extreme penalty' under Pilate. Romans were experts at execution — survival was not possible.", type: "hostile" },
      { tradition: "Jewish", color: "#5B8FD4", title: "Talmud — 'Hanged on Passover Eve'", text: "The Jewish legal text confirms the execution happened on Passover eve — matching the Gospel timeline exactly.", type: "hostile" },
      { tradition: "Islamic", color: "#6BAE84", title: "Quran — Surah 4:157 (Dissenting View)", text: "'They did not kill him, nor did they crucify him, but it was made to appear so.' The Quran is the only major source that denies the crucifixion — written 600 years later.", type: "dissenting" },
      { tradition: "Archaeological", color: "#D4A853", title: "Crucifixion Nail + Heel Bone (1968)", text: "Discovery of a crucified man's heel bone with a nail still embedded, from 1st-century Jerusalem. Confirms the exact method described in the Gospels.", type: "archaeological" },
    ],
    synthesis: "6 of 10 traditions confirm the crucifixion. Only the Quran (written 600 years later) and some Gnostic texts deny it. The hostile witnesses — Romans and Jews who had no reason to fabricate this — independently confirm it happened.",
  },
};

interface EvidenceCard {
  tradition: string;
  color: string;
  title: string;
  text: string;
  type: "hostile" | "primary" | "independent" | "dissenting" | "archaeological";
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  hostile: { label: "Hostile Witness", color: "text-red-500" },
  primary: { label: "Primary Source", color: "text-gold" },
  independent: { label: "Independent Tradition", color: "text-green-500" },
  dissenting: { label: "Dissenting View", color: "text-yellow-500" },
  archaeological: { label: "Archaeological", color: "text-blue-500" },
};

const PRESET_CATEGORIES = [
  {
    label: "Existence",
    questions: ["Did Jesus really exist?", "What non-Christian sources confirm Jesus existed?"],
  },
  {
    label: "Crucifixion",
    questions: ["Did Jesus actually die on the cross?", "The Quran says Jesus wasn't crucified — who's right?"],
  },
  {
    label: "Resurrection",
    questions: ["Did Jesus really rise from the dead?", "What's the earliest evidence for the resurrection?"],
  },
  {
    label: "Prophecy",
    questions: ["What are the odds of fulfilling all these prophecies?", "Could the prophecies have been written after the fact?"],
  },
  {
    label: "Skeptic",
    questions: ["Why should I believe there's an afterlife?", "Religion was invented to control people — change my mind"],
  },
];

export function CuriosityExperience({
  initialQuestion,
  dataStats,
}: {
  initialQuestion: string | null;
  dataStats: DataStats;
}) {
  const [question, setQuestion] = useState(initialQuestion || "");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(initialQuestion);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (initialQuestion) {
      setActiveQuestion(initialQuestion);
      setTimeout(() => setShowCards(true), 800);
    }
  }, [initialQuestion]);

  const handleAsk = (q: string) => {
    setQuestion(q);
    setActiveQuestion(q);
    setShowCards(false);
    setTimeout(() => setShowCards(true), 800);
  };

  const evidence = activeQuestion ? EVIDENCE_LIBRARY[activeQuestion] : null;

  return (
    <div>
      {/* Question input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) handleAsk(question.trim());
        }}
        className="flex gap-2 mb-8"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask any question about Jesus across all traditions..."
          className="flex-1 px-4 py-3 rounded-lg border bg-surface font-body text-sm focus:outline-none focus:ring-2 ring-[rgb(var(--gold))]"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90 transition-opacity shrink-0"
        >
          Ask
        </button>
      </form>

      {/* Preset questions */}
      {!activeQuestion && (
        <div className="space-y-6">
          {PRESET_CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <h3 className="font-heading text-sm text-parchment mb-2">{cat.label}</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {cat.questions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleAsk(q)}
                    className="text-left p-3 bg-surface rounded-lg border hover:border-[rgb(var(--gold))] transition-colors text-sm font-body"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 p-4 bg-surface rounded-lg border text-center">
            <p className="font-ui text-xs text-dim">
              Powered by {dataStats.sources} ancient sources &middot; {dataStats.prophecies} prophecies &middot; {dataStats.studies} scientific studies &middot; {dataStats.archaeology} archaeological discoveries
            </p>
          </div>
        </div>
      )}

      {/* Walkthrough experience */}
      {activeQuestion && (
        <div>
          {/* Question header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="font-heading text-xl text-parchment">&ldquo;{activeQuestion}&rdquo;</p>
            <p className="text-dim font-ui text-xs mt-2">
              Let&apos;s walk through the evidence together.
            </p>
          </motion.div>

          {/* Evidence cards */}
          {evidence ? (
            <AnimatePresence>
              {showCards && (
                <div className="space-y-4">
                  {evidence.cards.map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.4, duration: 0.5 }}
                      className="p-5 bg-surface rounded-lg border-l-4"
                      style={{ borderLeftColor: card.color }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-ui font-semibold" style={{ color: card.color }}>
                          {card.tradition}
                        </span>
                        <span className={`text-[10px] font-ui ${TYPE_LABELS[card.type]?.color}`}>
                          {TYPE_LABELS[card.type]?.label}
                        </span>
                      </div>
                      <h3 className="font-heading text-sm text-parchment mb-2">{card.title}</h3>
                      <p className="font-body text-sm leading-relaxed">{card.text}</p>
                    </motion.div>
                  ))}

                  {/* Synthesis */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: evidence.cards.length * 0.4 + 0.5, duration: 0.5 }}
                    className="mt-8 p-6 bg-[rgb(var(--gold)/.05)] rounded-lg border border-[rgb(var(--gold)/.2)]"
                  >
                    <h3 className="font-heading text-sm text-gold mb-2">The Full Picture</h3>
                    <p className="font-body text-sm leading-relaxed">{evidence.synthesis}</p>
                  </motion.div>

                  {/* Back button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: evidence.cards.length * 0.4 + 1 }}
                    className="flex gap-3 justify-center mt-6"
                  >
                    <button
                      onClick={() => { setActiveQuestion(null); setShowCards(false); setQuestion(""); }}
                      className="px-4 py-2 border text-dim rounded-lg font-ui text-sm hover:border-[rgb(var(--gold))] transition-colors"
                    >
                      Ask Another Question
                    </button>
                    <Link
                      href="/matrix"
                      className="px-4 py-2 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90"
                    >
                      View Universal Matrix
                    </Link>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-dim font-body mb-4">
                The AI walkthrough engine will answer this question with cited evidence
                from all {dataStats.sources}+ sources when the VPS is connected.
              </p>
              <p className="text-dim font-ui text-xs">
                For now, try one of the preset questions above for a demo walkthrough.
              </p>
              <button
                onClick={() => { setActiveQuestion(null); setShowCards(false); setQuestion(""); }}
                className="mt-4 px-4 py-2 border text-dim rounded-lg font-ui text-sm hover:border-[rgb(var(--gold))] transition-colors"
              >
                Back to Questions
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
