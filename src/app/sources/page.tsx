import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";
import { SourcesExplorer } from "./sources-explorer";

export const metadata = { title: "World Sources" };

const TRADITION_COLORS: Record<string, string> = {
  A: "#C9A96E", // Gold — Christian
  B: "#C9A96E",
  C: "#6BAE84", // Green — Islamic
  D: "#5B8FD4", // Blue — Jewish
  E: "#D4826B", // Copper — Roman
  F: "#A67EC8", // Purple — Mandaean
  G: "#D4A853", // Gold-amber — Bahai
  H: "#D4826B", // Copper — Eastern
  I: "#A67EC8", // Purple — Manichaean
  J: "#D4A853", // Gold-amber — Zoroastrian
};

export default async function SourcesPage() {
  const categories = await db.sourceCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      sources: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { parallels: true } } },
      },
    },
  });

  const data = categories.map((cat) => ({
    code: cat.code,
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    color: TRADITION_COLORS[cat.code] || "#C9A96E",
    sources: cat.sources.map((s) => ({
      slug: s.slug,
      title: s.title,
      type: s.type,
      date: s.date,
      content: s.content,
      parallelCount: s._count.parallels,
    })),
  }));

  const totalSources = data.reduce((sum, c) => sum + c.sources.length, 0);

  return (
    <>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-2 text-center">
          World Sources
        </h1>
        <p className="text-dim text-center font-body mb-2">
          {totalSources} sources from {data.length} civilizations — every tradition that wrote about Jesus
        </p>
        <p className="text-dim text-center font-ui text-xs mb-8">
          Christian, Islamic, Jewish, Roman, Mandaean, Bah&aacute;&apos;&iacute;, Eastern, Manichaean, Zoroastrian
        </p>
        <SourcesExplorer categories={data} />
      </main>
    </>
  );
}
