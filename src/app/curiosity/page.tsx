import { TopNav } from "@/components/nav/top-nav";
import { db } from "@/lib/db";
import { CuriosityExperience } from "./curiosity-experience";

export const metadata = { title: "Curiosity Engine" };

export default async function CuriosityPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  // Fetch relevant data for the AI to use
  const [scenes, prophecies, sources, studies, archaeology] = await Promise.all([
    db.scene.findMany({
      select: { slug: true, title: true, convergenceScore: true, dateApprox: true },
      orderBy: { sortOrder: "asc" },
      take: 60,
    }),
    db.prophecy.findMany({
      select: { slug: true, label: true, reference: true, fulfillmentType: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.worldSource.findMany({
      include: { category: { select: { name: true, code: true } } },
      orderBy: { sortOrder: "asc" },
    }),
    db.scientificStudy.findMany(),
    db.archaeologicalEvidence.findMany(),
  ]);

  return (
    <>
      <TopNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-2 text-center">
          The Curiosity Engine
        </h1>
        <p className="text-dim text-center font-body mb-8 max-w-xl mx-auto">
          Ask the hard questions. Every question gets a journey through the evidence
          — from {sources.length}+ ancient sources across {new Set(sources.map(s => s.category.code)).size} civilizations.
        </p>

        <CuriosityExperience
          initialQuestion={searchParams.q || null}
          dataStats={{
            scenes: scenes.length,
            prophecies: prophecies.length,
            sources: sources.length,
            studies: studies.length,
            archaeology: archaeology.length,
          }}
        />
      </main>
    </>
  );
}
