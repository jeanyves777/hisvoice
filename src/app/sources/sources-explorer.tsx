"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Source {
  slug: string;
  title: string;
  type: string | null;
  date: string | null;
  content: string | null;
  parallelCount: number;
}

interface Category {
  code: string;
  slug: string;
  name: string;
  description: string | null;
  color: string;
  sources: Source[];
}

export function SourcesExplorer({ categories }: { categories: Category[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = selected ? categories.filter((c) => c.code === selected) : categories;

  return (
    <div>
      {/* Tradition tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          onClick={() => setSelected(null)}
          className={`px-3 py-1.5 text-xs font-ui rounded-full transition-colors ${
            selected === null
              ? "bg-[rgb(var(--gold))] text-white"
              : "text-dim border hover:border-[rgb(var(--gold))]"
          }`}
        >
          All ({categories.reduce((s, c) => s + c.sources.length, 0)})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.code}
            onClick={() => setSelected(cat.code)}
            className={`px-3 py-1.5 text-xs font-ui rounded-full transition-all ${
              selected === cat.code
                ? "text-white"
                : "text-dim border hover:border-[rgb(var(--gold))]"
            }`}
            style={selected === cat.code ? { backgroundColor: cat.color } : undefined}
          >
            {cat.code}. {cat.name.split(" ")[0]} ({cat.sources.length})
          </button>
        ))}
      </div>

      {/* Categories + sources */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected ?? "all"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-10"
        >
          {filtered.map((cat) => (
            <section key={cat.code}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-ui font-bold"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.code}
                </span>
                <div>
                  <h2 className="font-heading text-lg text-parchment">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-dim text-xs font-body">{cat.description}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cat.sources.map((src, i) => (
                  <motion.div
                    key={src.slug}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={`/sources/${cat.slug}/${src.slug}`}
                      className="block p-4 bg-surface rounded-lg border hover:border-[rgb(var(--gold))] transition-all group h-full"
                      style={{ borderLeftWidth: 3, borderLeftColor: cat.color }}
                    >
                      <h3 className="font-heading text-sm text-parchment group-hover:text-gold transition-colors">
                        {src.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {src.type && (
                          <span className="text-xs font-ui text-dim">{src.type}</span>
                        )}
                      </div>
                      {src.date && (
                        <p className="text-xs font-ui text-dim mt-1">{src.date}</p>
                      )}
                      {src.content && (
                        <p className="text-xs font-body text-dim mt-2 line-clamp-2">
                          {src.content}
                        </p>
                      )}
                      {src.parallelCount > 0 && (
                        <p className="text-xs font-ui text-gold mt-2">
                          {src.parallelCount} gospel parallel{src.parallelCount > 1 ? "s" : ""}
                        </p>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
