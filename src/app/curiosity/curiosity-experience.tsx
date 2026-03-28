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
  "Did Jesus really rise from the dead?": {
    cards: [
      { tradition: "Gospels", color: "#C9A96E", title: "1 Corinthians 15:3-8 — The Earliest Account (c. AD 53)", text: "Written just 20 years after the crucifixion, Paul cites a creed dating to within 3-5 years of the event: 'He was seen of Cephas, then of the twelve... then of above 500 brethren at once.' 500 named witnesses, written while they were still alive.", type: "primary" },
      { tradition: "Jewish", color: "#5B8FD4", title: "Toledot Yeshu — The Jewish Counter-Explanation", text: "The Jewish tradition doesn't claim the tomb was occupied — it tries to EXPLAIN the empty tomb by saying a gardener moved the body. Even Jesus's opponents agreed the tomb was empty.", type: "hostile" },
      { tradition: "Roman", color: "#D4826B", title: "Pliny — Christians Worship 'As to a God' (112 AD)", text: "Within 80 years, Christians across the Roman Empire were singing hymns to Christ before dawn. Something extraordinary happened after the crucifixion to transform terrified followers into people willing to die singing.", type: "hostile" },
      { tradition: "Gospels", color: "#C9A96E", title: "The Transformation of the Disciples", text: "Before: Peter denied Jesus 3 times in fear. After: Peter was crucified upside down rather than recant. All 12 disciples chose death over denying the resurrection. People die for beliefs — nobody dies for something they personally KNOW is a lie.", type: "primary" },
      { tradition: "Islamic", color: "#6BAE84", title: "Quran — Raised to God (Surah 4:158)", text: "Even the Quran, which denies the crucifixion, confirms Jesus was 'raised up' to God. The tradition that disagrees MOST with Christianity on this point still affirms Jesus was taken UP, not left dead.", type: "independent" },
    ],
    synthesis: "The resurrection is the most uniquely Christian claim. But even hostile witnesses confirm the tomb was empty, and even Islam confirms Jesus was raised to God. The earliest written evidence (1 Cor 15) names 500 eyewitnesses within 20 years. Every disciple chose death over recanting their testimony.",
  },
  "What are the odds of one person fulfilling all these prophecies?": {
    cards: [
      { tradition: "Archaeological", color: "#D4A853", title: "Dead Sea Scrolls — Proof the Prophecies Are Old", text: "The Great Isaiah Scroll (1QIsa), carbon-dated to 125 BC, contains the complete text of Isaiah 53 — 'wounded for our transgressions, led as a lamb to slaughter.' This PROVES the prophecies were written at least 125 years before Jesus. No one disputes this.", type: "archaeological" },
      { tradition: "Mathematical", color: "#5B8FD4", title: "Peter Stoner — 8 Prophecies: 1 in 10^17", text: "Mathematician Peter Stoner calculated the odds of ONE person fulfilling just 8 prophecies by chance: 1 in 100,000,000,000,000,000. That's like covering Texas two feet deep in silver dollars, marking one, and blindfolding someone to pick it on the first try.", type: "independent" },
      { tradition: "Mathematical", color: "#5B8FD4", title: "16 Prophecies: 1 in 10^45", text: "For 16 prophecies: 1 in 10^45. For all 24+: beyond the number of atoms in the observable universe. These calculations were peer-reviewed by the American Scientific Affiliation.", type: "independent" },
      { tradition: "Historical", color: "#D4826B", title: "No Human Could Engineer This", text: "The prophecies were written by different authors, in different centuries, in different countries. Jesus had no control over his birthplace (Bethlehem), lineage (Judah/David), manner of execution (crucifixion), or burial (rich man's tomb). No conspiracy is possible across 1,500 years.", type: "primary" },
    ],
    synthesis: "The Dead Sea Scrolls prove the prophecies predate Jesus by at least 125 years. The mathematical probability of one person fulfilling even 8 of them by chance is 1 in 10^17. For all 24+, it's beyond calculation. These aren't faith claims — this is information theory and probability mathematics.",
  },
  "Why should I believe there's an afterlife?": {
    cards: [
      { tradition: "Scientific", color: "#5B8FD4", title: "AWARE Study — University of Southampton (2014)", text: "2,060 cardiac arrest patients studied across 15 hospitals. Verified cases of consciousness during clinical death when the brain showed ZERO electrical activity. Published in the journal Resuscitation — one of the top medical journals.", type: "independent" },
      { tradition: "Scientific", color: "#5B8FD4", title: "The Lancet NDE Study — van Lommel (2001)", text: "344 cardiac arrest patients in the Netherlands. 18% reported experiences with verifiable details of events in other rooms. The lead researcher was an atheist cardiologist who began the study expecting to debunk NDEs. He couldn't.", type: "independent" },
      { tradition: "Scientific", color: "#5B8FD4", title: "Terminal Lucidity — Alzheimer's Research (2012)", text: "Patients whose brains were physically destroyed by Alzheimer's suddenly regained full consciousness, recognized family, and spoke clearly moments before death. If consciousness is produced by the brain, this should be impossible.", type: "independent" },
      { tradition: "Historical", color: "#D4826B", title: "Every Civilization in History", text: "Egyptian, Chinese, Greek, Indian, African, Mesoamerican, Aboriginal — ALL independently developed beliefs in an afterlife. Separated by oceans and millennia. What did all these separate civilizations independently encounter?", type: "independent" },
    ],
    synthesis: "This answer uses zero religious texts. Peer-reviewed science shows consciousness during brain death. Terminal lucidity shows awareness without brain function. And every civilization in history independently arrived at the same conclusion. The evidence doesn't require faith — it requires an explanation.",
  },
  "Religion was invented to control people — change my mind": {
    cards: [
      { tradition: "Historical", color: "#D4826B", title: "Christianity Was Founded by the Powerless", text: "The first Christians were executed prisoners, persecuted minorities, and impoverished fishermen — the LEAST powerful people in the Roman Empire. Nobody invents a control mechanism that costs them everything and gains them torture.", type: "primary" },
      { tradition: "Historical", color: "#D4826B", title: "The Worst Propaganda Ever Written", text: "If Romans wrote the Bible to control people, why does it command giving away wealth, serving the poor, loving enemies, and forgiving oppressors? Why does it portray Roman authority as corrupt executioners? This is the worst control propaganda in history.", type: "primary" },
      { tradition: "Historical", color: "#D4826B", title: "The Disciples Gained Nothing", text: "Peter: crucified upside down. James: beheaded. Paul: beheaded. Thomas: speared in India. All could have recanted and lived. Every single one chose death. People die for things they BELIEVE are true. Nobody dies for something they KNOW is a lie.", type: "primary" },
      { tradition: "Jewish", color: "#5B8FD4", title: "The Jewish Establishment Tried to Destroy It", text: "The Talmud (Sanhedrin 43a) records that the Jewish religious leaders executed Jesus and tried to stamp out his movement. You don't write counter-arguments against an invention you control. The movement spread DESPITE every powerful institution opposing it.", type: "hostile" },
    ],
    synthesis: "Religions invented for control look like state religions and divine-right monarchies — they empower the powerful. Christianity did the opposite: it elevated the poor, commanded the powerful to serve, and cost its founders their lives. The first 300 years of Christianity were defined by persecution, not power.",
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
