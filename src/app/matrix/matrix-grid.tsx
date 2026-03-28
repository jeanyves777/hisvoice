"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CellStatus = "yes" | "no" | "partial" | "silent" | "unique";

interface Tradition {
  key: string;
  label: string;
  color: string;
}

interface MatrixCell {
  status: CellStatus;
  note: string;
}

interface MatrixRow {
  event: string;
  cells: Record<string, MatrixCell>;
  agreementScore: number;
}

interface MatrixGridProps {
  traditions: Tradition[];
  rows: MatrixRow[];
}

const STATUS_COLORS: Record<CellStatus, { bg: string; text: string; label: string }> = {
  yes: { bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", label: "Confirms" },
  no: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400", label: "Denies" },
  partial: { bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400", label: "Partial" },
  silent: { bg: "bg-gray-100 dark:bg-gray-800/30", text: "text-gray-500 dark:text-gray-500", label: "Silent" },
  unique: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", label: "Unique" },
};

const STATUS_DOT: Record<CellStatus, string> = {
  yes: "bg-green-500",
  no: "bg-red-500",
  partial: "bg-yellow-500",
  silent: "bg-gray-400",
  unique: "bg-blue-500",
};

export function MatrixGrid({ traditions, rows }: MatrixGridProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedCell, setExpandedCell] = useState<string | null>(null);

  return (
    <div>
      {/* Desktop grid view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse font-ui text-sm">
          <thead>
            <tr>
              <th className="text-left p-3 font-heading text-xs text-dim border-b w-48">
                Event
              </th>
              {traditions.map((t) => (
                <th
                  key={t.key}
                  className="p-3 text-center text-xs border-b font-semibold"
                  style={{ color: t.color }}
                >
                  {t.label}
                </th>
              ))}
              <th className="p-3 text-center text-xs text-gold border-b w-16">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.event}
                className="border-b hover:bg-surface/50 transition-colors cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === row.event ? null : row.event)}
              >
                <td className="p-3 font-heading text-xs text-parchment">
                  {row.event}
                </td>
                {traditions.map((t) => {
                  const cell = row.cells[t.key];
                  if (!cell) return <td key={t.key} className="p-3" />;
                  const style = STATUS_COLORS[cell.status];
                  return (
                    <td key={t.key} className="p-2 text-center">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] ${style.bg} ${style.text}`}
                        title={cell.note}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[cell.status]}`} />
                        {style.label}
                      </div>
                    </td>
                  );
                })}
                <td className="p-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(var(--gold)/.1)] text-gold text-xs font-bold">
                    {row.agreementScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="lg:hidden space-y-4">
        {rows.map((row) => (
          <div key={row.event} className="bg-surface rounded-lg border overflow-hidden">
            <button
              onClick={() => setExpandedRow(expandedRow === row.event ? null : row.event)}
              className="w-full text-left p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(var(--gold)/.1)] text-gold text-xs font-ui font-bold shrink-0">
                  {row.agreementScore}
                </span>
                <span className="font-heading text-sm text-parchment">{row.event}</span>
              </div>
              <span className="text-dim text-xs">{expandedRow === row.event ? "−" : "+"}</span>
            </button>

            <AnimatePresence>
              {expandedRow === row.event && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t pt-3 space-y-2">
                    {traditions.map((t) => {
                      const cell = row.cells[t.key];
                      if (!cell) return null;
                      const style = STATUS_COLORS[cell.status];
                      const cellKey = `${row.event}-${t.key}`;
                      return (
                        <button
                          key={t.key}
                          onClick={() => setExpandedCell(expandedCell === cellKey ? null : cellKey)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[cell.status]}`} />
                              <span className="text-xs font-ui" style={{ color: t.color }}>
                                {t.label}
                              </span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${style.bg} ${style.text}`}>
                              {style.label}
                            </span>
                          </div>
                          <AnimatePresence>
                            {expandedCell === cellKey && (
                              <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="text-xs text-dim font-body pl-4 pb-1"
                              >
                                {cell.note}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        {(Object.entries(STATUS_COLORS) as [CellStatus, { bg: string; text: string; label: string }][]).map(
          ([status, style]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
              <span className="text-xs font-ui text-dim">{style.label}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
