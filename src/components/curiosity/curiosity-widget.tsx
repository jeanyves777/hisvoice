"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_QUESTIONS: { category: string; questions: string[] }[] = [
  {
    category: "Did Jesus Exist?",
    questions: [
      "Was Jesus a real person or a myth?",
      "What non-Christian sources confirm Jesus existed?",
      "Why should I trust sources written decades after Jesus died?",
    ],
  },
  {
    category: "The Crucifixion",
    questions: [
      "Did Jesus actually die on the cross?",
      "The Quran says Jesus wasn't crucified — who's right?",
      "What do ALL the traditions say about the crucifixion?",
    ],
  },
  {
    category: "The Resurrection",
    questions: [
      "Did Jesus really rise from the dead?",
      "Could the disciples have stolen the body?",
      "What's the earliest evidence for the resurrection?",
    ],
  },
  {
    category: "Prophecy",
    questions: [
      "Could the prophecies have been written after the fact?",
      "What are the odds of one person fulfilling all these prophecies?",
      "How do the Dead Sea Scrolls prove the prophecies are old?",
    ],
  },
  {
    category: "For the Skeptic",
    questions: [
      "Why should I believe there's an afterlife?",
      "Religion was invented to control people — change my mind",
      "I'm an atheist. Why should I even look at this?",
    ],
  },
  {
    category: "Jesus in Other Religions",
    questions: [
      "What does Islam really say about Jesus?",
      "Why do 10 completely separate traditions ALL write about Jesus?",
      "Is there any religion that says Jesus didn't exist?",
    ],
  },
];

// Context-aware questions based on current page
function getContextQuestions(pathname: string): string[] {
  if (pathname.includes("/scene/crucifixion") || pathname.includes("/scene/the-crucifixion")) {
    return ["Did Jesus really die on the cross?", "Why does the Quran disagree?", "What did the Romans record?"];
  }
  if (pathname.includes("/scene/the-empty-tomb") || pathname.includes("/scene/mary-magdalene")) {
    return ["Did Jesus really rise from the dead?", "Could it have been a hallucination?"];
  }
  if (pathname.includes("/prophecies")) {
    return ["How do we know these weren't written after?", "What are the mathematical odds?"];
  }
  if (pathname.includes("/sources/islamic") || pathname.includes("/quran")) {
    return ["What does the Quran say about Jesus?", "Where do Islam and Christianity agree?"];
  }
  return [];
}

export function CuriosityWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const contextQuestions = getContextQuestions(pathname);

  const handleQuestion = (q: string) => {
    setOpen(false);
    router.push(`/curiosity?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[rgb(var(--gold))] to-[rgb(var(--gold-bright))] text-white shadow-lg shadow-[rgb(var(--gold)/.3)] flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(201,169,110,0.4)",
            "0 0 0 12px rgba(201,169,110,0)",
          ],
        }}
        transition={{
          boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        }}
      >
        <span className="text-2xl font-display">{open ? "×" : "?"}</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[70vh] bg-surface rounded-xl border shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b">
              <h3 className="font-heading text-sm text-gold">The Curiosity Engine</h3>
              <p className="text-xs text-dim font-body mt-1">
                Ask the hard questions. Powered by 70+ ancient sources.
              </p>
            </div>

            <div className="overflow-y-auto max-h-[50vh] p-3 space-y-4">
              {/* Context-aware questions */}
              {contextQuestions.length > 0 && (
                <div>
                  <p className="text-xs font-ui text-gold mb-2">Based on this page:</p>
                  <div className="space-y-1.5">
                    {contextQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuestion(q)}
                        className="w-full text-left p-2.5 text-xs font-body rounded-lg border border-[rgb(var(--gold)/.2)] bg-[rgb(var(--gold)/.05)] hover:border-[rgb(var(--gold))] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset categories */}
              {PRESET_QUESTIONS.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs font-ui text-dim mb-1.5">{cat.category}</p>
                  <div className="space-y-1.5">
                    {cat.questions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuestion(q)}
                        className="w-full text-left p-2.5 text-xs font-body rounded-lg border hover:border-[rgb(var(--gold))] hover:bg-[rgb(var(--gold)/.03)] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom question input */}
            <div className="p-3 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector("input") as HTMLInputElement;
                  if (input.value.trim()) handleQuestion(input.value.trim());
                }}
              >
                <input
                  type="text"
                  placeholder="Ask your own question..."
                  className="w-full px-3 py-2 text-xs font-body rounded-lg border bg-primary focus:outline-none focus:ring-1 ring-[rgb(var(--gold))]"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
