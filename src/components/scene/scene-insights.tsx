/**
 * Scene Insights — Auto-generated from database data.
 * No hardcoded content. Every insight comes from real data analysis.
 */

interface InsightProps {
  convergenceScore: number;
  gospels: string[];
  prophecyCount: number;
  sourceCount: number;
  wordsCount: number;
  gapNotesCount: number;
  hasLocation: boolean;
}

export function SceneInsights({
  convergenceScore,
  gospels,
  prophecyCount,
  sourceCount,
  wordsCount,
  gapNotesCount,
}: InsightProps) {
  const insights: string[] = [];

  // Convergence insight
  if (convergenceScore === 4) {
    insights.push("This event is recorded in ALL four Gospels — the strongest possible convergence. Only a few events achieve this.");
  } else if (convergenceScore === 3) {
    const missing = ["matthew", "mark", "luke", "john"].filter((g) => !gospels.includes(g));
    insights.push(`Recorded in 3 of 4 Gospels. ${missing[0]?.charAt(0).toUpperCase()}${missing[0]?.slice(1)} does not include this event — check the Gap Analysis tab for what this might mean.`);
  } else if (convergenceScore === 1) {
    insights.push(`Unique to ${gospels[0]?.charAt(0).toUpperCase()}${gospels[0]?.slice(1)} — no other Gospel records this event. This makes it especially valuable as a unique eyewitness tradition.`);
  }

  // Prophecy insight
  if (prophecyCount > 0) {
    insights.push(`This scene fulfills ${prophecyCount} Old Testament prophec${prophecyCount > 1 ? "ies" : "y"} written hundreds of years before the event occurred.`);
  }

  // External sources insight
  if (sourceCount > 0) {
    insights.push(`${sourceCount} external source${sourceCount > 1 ? "s" : ""} from outside the Bible reference${sourceCount === 1 ? "s" : ""} this event — cross-tradition confirmation.`);
  }

  // Jesus words insight
  if (wordsCount > 0) {
    insights.push(`Contains ${wordsCount} recorded direct word${wordsCount > 1 ? "s" : ""} of Jesus.`);
  }

  // Gap notes insight
  if (gapNotesCount > 0) {
    insights.push(`The Gospel accounts show ${gapNotesCount} notable difference${gapNotesCount > 1 ? "s" : ""} — these reveal unique eyewitness perspectives.`);
  }

  if (insights.length === 0) return null;

  return (
    <div className="p-4 bg-[rgb(var(--gold)/.04)] rounded-lg border border-[rgb(var(--gold)/.15)] mb-6">
      <h3 className="font-heading text-xs text-gold mb-3 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Insights
      </h3>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="text-xs font-body text-dim leading-relaxed flex gap-2">
            <span className="text-gold shrink-0">•</span>
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
