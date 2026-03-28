"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

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
  ollamaAvailable: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  cards?: EvidenceCard[];
  followUps?: string[];
  meta?: { level: number; toolsUsed: string[]; dataPoints: number; aiPowered: boolean };
  timestamp: Date;
}

const SUGGESTED = [
  "Did Jesus really exist?",
  "What did the Romans write about Jesus?",
  "Where do the Quran and Gospels agree?",
  "What are the 7 Last Words from the Cross?",
  "What are the odds of fulfilling all these prophecies?",
  "Why should I believe there's an afterlife?",
  "Religion was invented to control people — change my mind",
  "What did hostile witnesses say about Jesus's miracles?",
];

const TYPE_LABELS: Record<string, { label: string; className: string }> = {
  hostile: { label: "Hostile Witness", className: "text-red-500" },
  primary: { label: "Primary Source", className: "text-gold" },
  independent: { label: "Independent", className: "text-green-500" },
  dissenting: { label: "Dissenting", className: "text-yellow-500" },
  archaeological: { label: "Archaeological", className: "text-blue-400" },
  scientific: { label: "Scientific", className: "text-blue-400" },
};

export function IntelligenceChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/intelligence/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text.trim() }),
      });

      if (!res.ok) throw new Error("Agent request failed");

      const data: AgentResponse = await res.json();

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.synthesis,
        cards: data.cards,
        followUps: data.followUps,
        meta: {
          level: data.level,
          toolsUsed: data.toolsUsed,
          dataPoints: data.dataPoints,
          aiPowered: data.aiPowered,
        },
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, the intelligence engine encountered an error. Please try again.", timestamp: new Date() },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[700px] bg-surface rounded-xl border overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="font-heading text-lg text-parchment mb-6">
              Ask anything about Jesus across all traditions
            </p>
            <div className="grid gap-2 sm:grid-cols-2 max-w-lg mx-auto">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left p-3 text-xs font-body rounded-lg border hover:border-[rgb(var(--gold))] hover:bg-[rgb(var(--gold)/.03)] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg px-4 py-3 bg-[rgb(var(--gold))] text-white text-sm font-body">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Evidence cards */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="space-y-2">
                    {msg.cards.map((card, ci) => (
                      <motion.div
                        key={ci}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ci * 0.15 }}
                        className="p-4 bg-primary rounded-lg border-l-4"
                        style={{ borderLeftColor: card.color }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-ui font-semibold" style={{ color: card.color }}>
                            {card.tradition}
                          </span>
                          <span className={`text-[10px] font-ui ${TYPE_LABELS[card.type]?.className || "text-dim"}`}>
                            {TYPE_LABELS[card.type]?.label || card.type}
                          </span>
                        </div>
                        <h4 className="font-heading text-xs text-parchment mb-1">{card.title}</h4>
                        <p className="text-xs font-body leading-relaxed text-dim">{card.text}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Synthesis */}
                <div className="max-w-[90%] rounded-lg px-4 py-3 bg-primary border text-sm font-body leading-relaxed">
                  {msg.content}
                </div>

                {/* Meta info */}
                {msg.meta && (
                  <div className="flex flex-wrap gap-3 text-[10px] font-ui text-dim/60 px-1">
                    <span>{msg.meta.dataPoints} data points queried</span>
                    <span>{msg.meta.toolsUsed.length} tools used</span>
                    <span>Level {msg.meta.level}/4</span>
                    <span>{msg.meta.aiPowered ? "Ollama-enhanced" : "Agent reasoning"}</span>
                  </div>
                )}

                {/* Follow-ups */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-1">
                    {msg.followUps.map((fq) => (
                      <button
                        key={fq}
                        onClick={() => handleSend(fq)}
                        className="text-xs font-body px-3 py-1.5 rounded-full border hover:border-[rgb(var(--gold))] hover:text-gold transition-colors"
                      >
                        {fq}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <p className="text-xs font-ui text-dim animate-pulse">Searching database...</p>
            <div className="flex gap-1 px-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-[rgb(var(--gold))] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        className="flex gap-2 p-4 border-t"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Jesus across all traditions..."
          className="flex-1 px-4 py-2.5 rounded-lg border bg-primary font-body text-sm focus:outline-none focus:ring-2 ring-[rgb(var(--gold))]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90 disabled:opacity-50 shrink-0"
        >
          {loading ? "..." : "Ask"}
        </button>
      </form>
    </div>
  );
}
