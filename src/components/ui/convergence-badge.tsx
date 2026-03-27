"use client";

const GOSPEL_COLORS: Record<string, string> = {
  matthew: "bg-[rgb(var(--matthew))]",
  mark: "bg-[rgb(var(--mark))]",
  luke: "bg-[rgb(var(--luke))]",
  john: "bg-[rgb(var(--john))]",
};

const GOSPEL_ORDER = ["matthew", "mark", "luke", "john"];

interface ConvergenceBadgeProps {
  score: number;
  gospels?: string[];
  size?: "sm" | "md" | "lg";
}

export function ConvergenceBadge({
  score,
  gospels,
  size = "md",
}: ConvergenceBadgeProps) {
  const dotSize = size === "sm" ? "w-2 h-2" : size === "lg" ? "w-4 h-4" : "w-3 h-3";
  const gap = size === "sm" ? "gap-0.5" : "gap-1";

  return (
    <div className={`flex items-center ${gap}`} title={`${score}/4 Gospels`}>
      {GOSPEL_ORDER.map((g) => {
        const isActive = gospels ? gospels.includes(g) : GOSPEL_ORDER.indexOf(g) < score;
        return (
          <span
            key={g}
            className={`${dotSize} rounded-full transition-all ${
              isActive ? GOSPEL_COLORS[g] : "bg-[rgb(var(--border))]"
            }`}
          />
        );
      })}
    </div>
  );
}
