import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";

export default async function SourceDetailPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const source = await db.worldSource.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      parallels: {
        include: {
          scene: { select: { slug: true, title: true, dateApprox: true } },
        },
      },
    },
  });

  if (!source) notFound();

  return (
    <>
      <TopNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm font-ui text-dim mb-6">
          <Link href="/sources" className="hover:text-gold transition-colors">Sources</Link>
          <span className="text-dim/50">/</span>
          <Link href={`/sources/${source.category.slug}`} className="hover:text-gold transition-colors">
            {source.category.name}
          </Link>
          <span className="text-dim/50">/</span>
          <span className="text-parchment">{source.title}</span>
        </div>

        {/* Editorial disclaimer */}
        <div className="mb-6 p-4 bg-[rgb(var(--gold)/.05)] rounded-lg border border-[rgb(var(--gold)/.2)] text-sm font-body text-dim">
          This text comes from the <strong>{source.category.name}</strong> tradition.
          It is presented here as a historical witness to the life of Jesus. His Voice
          does not endorse or oppose any tradition — we present the fullest possible record.
        </div>

        <h1 className="font-heading text-2xl text-parchment mb-2">{source.title}</h1>
        <div className="flex gap-3 text-sm font-ui text-dim mb-6">
          {source.type && <span>{source.type}</span>}
          {source.date && <span>{source.date}</span>}
        </div>

        {source.content && (
          <div className="mb-6">
            <h2 className="font-heading text-sm text-gold mb-2">Summary</h2>
            <p className="font-body">{source.content}</p>
          </div>
        )}

        {source.reliability && (
          <div className="mb-6">
            <h2 className="font-heading text-sm text-gold mb-2">Scholarly Assessment</h2>
            <p className="font-body text-dim">{source.reliability}</p>
          </div>
        )}

        {source.fullText && (
          <div className="mb-6 p-6 bg-surface rounded-lg border">
            <h2 className="font-heading text-sm text-gold mb-3">Text</h2>
            <div className="font-body leading-relaxed whitespace-pre-wrap">{source.fullText}</div>
          </div>
        )}

        {source.parallels.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading text-lg text-parchment mb-4">Parallel Gospel Events</h2>
            <div className="space-y-2">
              {source.parallels.map((p) => (
                <Link
                  key={p.id}
                  href={`/scene/${p.scene.slug}`}
                  className="block p-3 bg-surface rounded-lg border hover:border-gold transition-colors"
                >
                  <span className="font-heading text-sm text-parchment">{p.scene.title}</span>
                  {p.scene.dateApprox && <span className="text-xs font-ui text-dim ml-2">{p.scene.dateApprox}</span>}
                  {p.note && <p className="text-sm font-body text-dim mt-1">{p.note}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
