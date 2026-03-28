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

interface EvidenceCard {
  tradition: string;
  color: string;
  title: string;
  text: string;
  type: string;
  sourceSlug?: string;
}

interface AgentResponse {
  question: string;
  level: number;
  cards: EvidenceCard[];
  synthesis: string;
  followUps: string[];
  toolsUsed: string[];
  dataPoints: number;
  aiPowered: boolean;
}

const TYPE_LABELS: Record<string, { label: string; className: string }> = {
  hostile: { label: "Hostile Witness", className: "text-red-500" },
  primary: { label: "Primary Source", className: "text-gold" },
  independent: { label: "Independent", className: "text-green-500" },
  dissenting: { label: "Dissenting", className: "text-yellow-500" },
  archaeological: { label: "Archaeological", className: "text-blue-400" },
  scientific: { label: "Scientific", className: "text-blue-400" },
};

const PRESET_CATEGORIES = [
  {
    label: "Did Jesus Exist?",
    questions: ["Was Jesus a real historical person?", "What non-Christian sources confirm Jesus existed?"],
  },
  {
    label: "The Crucifixion",
    questions: ["Did Jesus actually die on the cross?", "The Quran says Jesus wasn't crucified — who's right?"],
  },
  {
    label: "The Resurrection",
    questions: ["Did Jesus really rise from the dead?", "What's the earliest evidence for the resurrection?"],
  },
  {
    label: "Prophecy & Mathematics",
    questions: ["What are the odds of fulfilling all these prophecies?", "How do the Dead Sea Scrolls prove the prophecies are old?"],
  },
  {
    label: "For the Pure Skeptic",
    questions: ["Why should I believe there's an afterlife?", "Religion was invented to control people — change my mind"],
  },
  {
    label: "Jesus in Other Religions",
    questions: ["What does the Quran really say about Jesus?", "Why do 10 separate traditions all write about Jesus?"],
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
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);

  const handleAsk = async (q: string) => {
    setQuestion(q);
    setActiveQuestion(q);
    setResponse(null);
    setShowCards(false);
    setLoading(true);

    try {
      const res = await fetch("/api/intelligence/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) throw new Error("Failed");

      const data: AgentResponse = await res.json();
      setResponse(data);
      // Stagger card appearance
      setTimeout(() => setShowCards(true), 300);
    } catch {
      setResponse({
        question: q,
        level: 2,
        cards: [],
        synthesis: "The intelligence engine encountered an error. Please try again.",
        followUps: [],
        toolsUsed: [],
        dataPoints: 0,
        aiPowered: false,
      });
      setShowCards(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (initialQuestion) handleAsk(initialQuestion);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {/* Question input */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (question.trim()) handleAsk(question.trim()); }}
        className="flex gap-2 mb-8"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask any question about Jesus across all traditions..."
          className="flex-1 px-4 py-3 rounded-lg border bg-surface font-body text-sm focus:outline-none focus:ring-2 ring-[rgb(var(--gold))]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90 disabled:opacity-50 shrink-0"
        >
          {loading ? "Searching..." : "Ask"}
        </button>
      </form>

      {/* Presets — show when no active question */}
      {!activeQuestion && !loading && (
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
              Powered by {dataStats.sources} ancient sources &middot; {dataStats.prophecies} prophecies &middot;
              {dataStats.studies} scientific studies &middot; {dataStats.archaeology} archaeological discoveries
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="font-heading text-lg text-parchment">&ldquo;{activeQuestion}&rdquo;</p>
            <p className="text-dim font-ui text-sm animate-pulse">Searching {dataStats.sources}+ sources across {10} civilizations...</p>
            <div className="flex gap-1.5 justify-center mt-4">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2.5 h-2.5 rounded-full bg-[rgb(var(--gold))] animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Results */}
      {response && !loading && (
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <p className="font-heading text-xl text-parchment">&ldquo;{response.question}&rdquo;</p>
            <p className="text-dim font-ui text-xs mt-2">
              {response.dataPoints} data points searched &middot; {response.toolsUsed.length} tools used &middot;
              Level {response.level}/4 &middot; {response.aiPowered ? "Ollama-enhanced" : "Agent reasoning"}
            </p>
          </motion.div>

          {/* Evidence cards */}
          <AnimatePresence>
            {showCards && response.cards.length > 0 && (
              <div className="space-y-3 mb-6">
                {response.cards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.4 }}
                    className="p-5 bg-surface rounded-lg border-l-4"
                    style={{ borderLeftColor: card.color }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-ui font-semibold" style={{ color: card.color }}>
                        {card.tradition}
                      </span>
                      <span className={`text-[10px] font-ui ${TYPE_LABELS[card.type]?.className || "text-dim"}`}>
                        {TYPE_LABELS[card.type]?.label || card.type}
                      </span>
                    </div>
                    <h3 className="font-heading text-sm text-parchment mb-2">{card.title}</h3>
                    <p className="font-body text-sm leading-relaxed">{card.text}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Synthesis */}
          {showCards && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: response.cards.length * 0.2 + 0.3 }}
              className="p-6 bg-[rgb(var(--gold)/.05)] rounded-lg border border-[rgb(var(--gold)/.2)] mb-6"
            >
              <h3 className="font-heading text-sm text-gold mb-2">The Full Picture</h3>
              <p className="font-body text-sm leading-relaxed">{response.synthesis}</p>
            </motion.div>
          )}

          {/* Follow-ups */}
          {showCards && response.followUps.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: response.cards.length * 0.2 + 0.6 }}
              className="space-y-3"
            >
              <p className="font-ui text-xs text-dim">You might also wonder:</p>
              <div className="flex flex-wrap gap-2">
                {response.followUps.map((fq) => (
                  <button
                    key={fq}
                    onClick={() => handleAsk(fq)}
                    className="text-xs font-body px-4 py-2 rounded-full border hover:border-[rgb(var(--gold))] hover:text-gold transition-colors"
                  >
                    {fq}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={() => { setActiveQuestion(null); setResponse(null); setShowCards(false); setQuestion(""); }}
                  className="px-4 py-2 border text-dim rounded-lg font-ui text-sm hover:border-[rgb(var(--gold))] transition-colors"
                >
                  Ask Another Question
                </button>
                <Link href="/matrix" className="px-4 py-2 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90">
                  View Universal Matrix
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
