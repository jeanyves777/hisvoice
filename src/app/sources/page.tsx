import Link from "next/link";
import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";

export const metadata = { title: "World Sources" };

export default async function SourcesPage() {
  const categories = await db.sourceCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { sources: true } } },
  });

  return (
    <>
      <TopNav />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-2 text-center">World Sources</h1>
        <p className="text-dim text-center font-body mb-10">
          70+ sources from 10 civilizations — every tradition that wrote about Jesus
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/sources/${cat.slug}`}
              className="p-5 bg-surface rounded-lg border hover:border-gold transition-colors"
            >
              <span className="font-ui text-xs text-gold">{cat.code}</span>
              <h2 className="font-heading text-lg text-parchment mt-1">{cat.name}</h2>
              <p className="text-dim text-sm font-body mt-1">{cat.description}</p>
              <p className="text-xs font-ui text-dim mt-2">{cat._count.sources} sources</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
