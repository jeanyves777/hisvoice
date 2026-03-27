"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ConvergenceBadge } from "@/components/ui/convergence-badge";

interface TimelineCardProps {
  slug: string;
  title: string;
  subtitle?: string | null;
  dateApprox?: string | null;
  convergenceScore: number;
  gospels?: string[];
  locationLabel?: string | null;
  index: number;
}

export function TimelineCard({
  slug,
  title,
  subtitle,
  dateApprox,
  convergenceScore,
  gospels,
  locationLabel,
  index,
}: TimelineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={`/scene/${slug}`}
        className="block p-4 bg-surface rounded-lg border border-[rgb(var(--border))] hover:border-[rgb(var(--gold))] transition-all duration-200 group hover:translate-x-1 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-sm text-parchment group-hover:text-gold transition-colors truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-dim text-xs mt-0.5 font-body truncate">{subtitle}</p>
            )}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {dateApprox && (
                <span className="text-xs font-ui text-dim">{dateApprox}</span>
              )}
              {locationLabel && (
                <span className="text-xs font-ui text-dim">{locationLabel}</span>
              )}
            </div>
          </div>
          <ConvergenceBadge score={convergenceScore} gospels={gospels} size="sm" />
        </div>
      </Link>
    </motion.div>
  );
}
