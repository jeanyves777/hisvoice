"use client";

const GOSPEL_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  matthew: {
    text: "text-[rgb(var(--matthew))]",
    bg: "bg-[rgb(var(--matthew)/.1)]",
    border: "border-[rgb(var(--matthew))]",
  },
  mark: {
    text: "text-[rgb(var(--mark))]",
    bg: "bg-[rgb(var(--mark)/.1)]",
    border: "border-[rgb(var(--mark))]",
  },
  luke: {
    text: "text-[rgb(var(--luke))]",
    bg: "bg-[rgb(var(--luke)/.1)]",
    border: "border-[rgb(var(--luke))]",
  },
  john: {
    text: "text-[rgb(var(--john))]",
    bg: "bg-[rgb(var(--john)/.1)]",
    border: "border-[rgb(var(--john))]",
  },
};

interface GospelTagProps {
  gospel: string;
  className?: string;
}

export function GospelTag({ gospel, className = "" }: GospelTagProps) {
  const style = GOSPEL_STYLES[gospel] || GOSPEL_STYLES.matthew;
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-ui font-semibold capitalize rounded border ${style.text} ${style.bg} ${style.border} ${className}`}
    >
      {gospel}
    </span>
  );
}

export function getGospelBorderColor(gospel: string): string {
  return GOSPEL_STYLES[gospel]?.border || "";
}

export function getGospelTextColor(gospel: string): string {
  return GOSPEL_STYLES[gospel]?.text || "";
}
