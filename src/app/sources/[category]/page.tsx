import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";

export default async function SourceCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = await db.sourceCategory.findUnique({
    where: { slug: params.category },
    include: {
      sources: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!category) notFound();

  return (
    <>
      <TopNav />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm font-ui text-dim mb-6">
          <Link href="/sources" className="hover:text-gold transition-colors">Sources</Link>
          <span className="text-dim/50">/</span>
          <span className="text-parchment">{category.name}</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="font-ui text-xs px-2 py-0.5 rounded-full bg-[rgb(var(--gold)/.1)] text-gold">
            {category.code}
          </span>
          <h1 className="font-heading text-2xl text-parchment">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-dim font-body mb-8">{category.description}</p>
        )}

        {category.sources.length === 0 ? (
          <p className="text-dim font-body italic">Sources coming soon...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {category.sources.map((src) => (
              <Link
                key={src.id}
                href={`/sources/${category.slug}/${src.slug}`}
                className="p-4 bg-surface rounded-lg border hover:border-gold transition-colors"
              >
                <h2 className="font-heading text-sm text-parchment">{src.title}</h2>
                {src.type && <p className="text-xs font-ui text-dim mt-1">{src.type}</p>}
                {src.date && <p className="text-xs font-ui text-dim">{src.date}</p>}
                {src.content && <p className="text-sm font-body text-dim mt-2 line-clamp-2">{src.content}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
