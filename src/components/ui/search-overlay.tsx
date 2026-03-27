"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";

interface SearchItem {
  type: "scene" | "prophecy" | "source";
  slug: string;
  title: string;
  subtitle?: string;
  href: string;
}

interface SearchOverlayProps {
  items: SearchItem[];
}

export function SearchOverlay({ items }: SearchOverlayProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = useRef(
    new Fuse(items, {
      keys: ["title", "subtitle"],
      threshold: 0.3,
      includeScore: true,
    })
  );

  // Update fuse when items change
  useEffect(() => {
    fuse.current = new Fuse(items, {
      keys: ["title", "subtitle"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [items]);

  // Keyboard shortcut: Ctrl+K or /
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || (e.key === "/" && !open)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (q.length < 2) {
        setResults([]);
        return;
      }
      const res = fuse.current.search(q).slice(0, 10);
      setResults(res.map((r) => r.item));
    },
    []
  );

  const handleSelect = (item: SearchItem) => {
    setOpen(false);
    router.push(item.href);
  };

  const TYPE_LABELS: Record<string, { label: string; color: string }> = {
    scene: { label: "Scene", color: "text-gold" },
    prophecy: { label: "Prophecy", color: "text-prophecy" },
    source: { label: "Source", color: "text-john" },
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-ui text-dim border rounded-md hover:border-[rgb(var(--gold))] transition-colors"
      >
        <span>Search</span>
        <kbd className="text-xs px-1.5 py-0.5 bg-primary rounded text-dim/60">
          Ctrl+K
        </kbd>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Search panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-surface rounded-xl border shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search scenes, prophecies, sources..."
                className="w-full px-5 py-4 bg-transparent font-body text-lg text-[rgb(var(--text-body))] placeholder:text-dim/50 focus:outline-none border-b"
              />

              {results.length > 0 && (
                <ul className="max-h-80 overflow-y-auto py-2">
                  {results.map((item) => (
                    <li key={`${item.type}-${item.slug}`}>
                      <button
                        onClick={() => handleSelect(item)}
                        className="w-full text-left px-5 py-3 hover:bg-primary/50 transition-colors flex items-center gap-3"
                      >
                        <span
                          className={`text-xs font-ui ${TYPE_LABELS[item.type]?.color}`}
                        >
                          {TYPE_LABELS[item.type]?.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-sm text-parchment truncate">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-xs text-dim truncate">{item.subtitle}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {query.length >= 2 && results.length === 0 && (
                <p className="px-5 py-4 text-dim text-sm font-body">
                  No results found for &ldquo;{query}&rdquo;
                </p>
              )}

              <div className="px-5 py-2 border-t text-xs font-ui text-dim/50 flex gap-4">
                <span>ESC to close</span>
                <span>Enter to select</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
