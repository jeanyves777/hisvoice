import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";
import { TimelineView } from "./timeline-view";

export const metadata = { title: "Timeline" };

export default async function TimelinePage() {
  const acts = await db.act.findMany({
    include: {
      scenes: {
        orderBy: { sortOrder: "asc" },
        include: {
          location: true,
          accounts: { select: { gospel: true } },
        },
      },
    },
    orderBy: { number: "asc" },
  });

  const data = acts.map((act) => ({
    number: act.number,
    slug: act.slug,
    title: act.title,
    subtitle: act.subtitle,
    timeRange: act.timeRange,
    description: act.description,
    scenes: act.scenes.map((s) => ({
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle,
      dateApprox: s.dateApprox,
      convergenceScore: s.convergenceScore,
      gospels: s.accounts.map((a) => a.gospel),
      locationLabel: s.location?.label ?? null,
    })),
  }));

  return (
    <>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-2 text-center">
          The Journey
        </h1>
        <p className="text-dim text-center font-body mb-8">
          From the first prophecy to the resurrection — every event, every word
        </p>
        <TimelineView acts={data} />
      </main>
    </>
  );
}
