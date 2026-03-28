"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "How many traditions confirm Jesus existed?",
  "What did the Romans write about Jesus?",
  "Where do the Quran and Gospels agree?",
  "What are the 7 Last Words from the Cross?",
  "Which prophecy has the strongest mathematical evidence?",
  "What did hostile witnesses say about Jesus's miracles?",
];

// Pre-built responses (until VPS AI is connected)
const KNOWLEDGE_BASE: Record<string, string> = {
  "how many traditions confirm jesus existed": "Jesus's existence is confirmed by ALL 10 independent traditions in our database:\n\n1. **Canonical Gospels** (4 accounts)\n2. **Islamic Quran** (25 chapters, 93+ verses)\n3. **Jewish Talmud** (Sanhedrin 43a)\n4. **Roman historians** (Tacitus, Pliny, Suetonius)\n5. **Gnostic texts** (Gospel of Thomas, Peter, Mary)\n6. **Bahá'í writings** (Kitáb-i-Íqán)\n7. **Mandaean texts** (Ginza Rabba)\n8. **Manichaean texts** (Psalm-Book)\n9. **Greek philosophers** (Celsus, Lucian, Thallus)\n10. **Josephus** (Jewish historian)\n\nNo other figure in human history is attested by this many independent civilizations. The Agreement Score for Jesus's existence is **10/10**.",

  "what did the romans write about jesus": "Three major Roman sources confirm Jesus:\n\n**Tacitus (116 AD):** 'Christus, from whom the name had its origin, suffered the extreme penalty during the reign of Tiberius at the hands of one of our procurators, Pontius Pilatus.' — Annals XV.44\n\n**Pliny the Younger (112 AD):** 'They were in the habit of meeting on a fixed day before dawn and singing a hymn to Christ as to a god.' — Letter X.96 to Emperor Trajan\n\n**Suetonius (121 AD):** 'He expelled the Jews from Rome who were constantly making disturbances at the instigation of Chrestus.' — Life of Claudius 25\n\nAll three are hostile witnesses — none were Christian sympathizers. They confirm: Jesus existed, was executed under Pilate, and had followers who worshipped him as divine within decades of his death.",

  "where do the quran and gospels agree": "The Quran and Gospels agree on remarkably many points about Jesus:\n\n✅ **Virgin birth** — Both confirm Mary conceived without a human father\n✅ **Born of Mary** — 'Maryam' in the Quran, one of the most honored women\n✅ **Performed miracles** — Healing the blind, raising the dead\n✅ **Had disciples** — 'al-Hawariyyun' in Arabic\n✅ **Called Messiah** — 'al-Masih' appears 11 times in the Quran\n✅ **Called Word of God** — 'Kalimatullah' in Surah 4:171\n✅ **Ascended to heaven** — Surah 4:158\n✅ **Will return** — Islamic hadith confirms the Second Coming\n\nKey difference: The Quran denies the crucifixion (Surah 4:157) and denies Jesus is the Son of God. But the agreements far outnumber the disagreements.",

  "what are the 7 last words from the cross": "The 7 Last Words of Christ, compiled from all 4 Gospels:\n\n1. **'Father, forgive them; for they know not what they do.'** — Luke 23:34 (Unique to Luke)\n2. **'Today shalt thou be with me in paradise.'** — Luke 23:43 (Unique to Luke)\n3. **'Woman, behold thy son... Behold thy mother.'** — John 19:26-27 (Unique to John)\n4. **'My God, my God, why hast thou forsaken me?'** — Matt 27:46; Mark 15:34 (Psalm 22:1 fulfilled)\n5. **'I thirst.'** — John 19:28 (Unique to John — fulfills Psalm 69:21)\n6. **'It is finished.'** — John 19:30 (Unique to John — 'tetelestai' = paid in full)\n7. **'Father, into thy hands I commend my spirit.'** — Luke 23:46 (Unique to Luke — Psalm 31:5)\n\nNo single gospel records all 7. You need all 4 together to hear every word He spoke from the Cross. This is the Gospel Harmony in action.",
};

function findResponse(question: string): string {
  const q = question.toLowerCase().trim();
  for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
    if (q.includes(key) || key.split(" ").filter(w => w.length > 3).every(w => q.includes(w))) {
      return value;
    }
  }
  return "This question will be answered by the AI Intelligence engine when the VPS is connected with Ollama. The system will search across all 40+ world sources, 57 scenes, 24 prophecies, and 49 recorded words of Jesus to build a comprehensive, cited response.\n\nFor now, try one of the suggested questions above for a demo response.";
}

export function IntelligenceChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = findResponse(text);
      const assistantMsg: Message = { role: "assistant", content: response, timestamp: new Date() };
      setMessages((prev) => [...prev, assistantMsg]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[600px] bg-surface rounded-xl border overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="font-heading text-lg text-parchment mb-4">
              Ask anything about Jesus across all traditions
            </p>
            <div className="grid gap-2 sm:grid-cols-2 max-w-lg mx-auto">
              {SUGGESTED_QUESTIONS.map((q) => (
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
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-[rgb(var(--gold))] text-white font-body"
                  : "bg-primary border font-body"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-parchment">$1</strong>')
                    .replace(/✅/g, '<span class="text-green-500">✅</span>')
                }} />
              ) : (
                msg.content
              )}
            </div>
          </motion.div>
        ))}

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 px-4 py-3">
            <span className="w-2 h-2 rounded-full bg-[rgb(var(--gold))] animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-[rgb(var(--gold))] animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-[rgb(var(--gold))] animate-bounce" style={{ animationDelay: "300ms" }} />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
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
          disabled={typing}
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          className="px-5 py-2.5 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  );
}
