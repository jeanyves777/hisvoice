import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";

export default async function ScenePage({
  params,
}: {
  params: { id: string };
}) {
  const scene = await db.scene.findUnique({
    where: { slug: params.id },
    include: {
      act: true,
      accounts: { include: { translations: true }, orderBy: { sortOrder: "asc" } },
      jesusWords: { orderBy: { sortOrder: "asc" } },
      gapNotes: { orderBy: { sortOrder: "asc" } },
      fulfillments: { include: { prophecy: true } },
      sourceParallels: { include: { source: { include: { category: true } } } },
      location: true,
    },
  });

  if (!scene) notFound();

  return (
    <>
      <TopNav />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-ui text-dim mb-6">
          <Link href="/timeline" className="hover:text-gold">Timeline</Link>
          <span>/</span>
          <span>Act {scene.act.number}</span>
          <span>/</span>
          <span className="text-parchment">{scene.title}</span>
        </div>

        {/* Header */}
        <h1 className="font-heading text-3xl text-parchment mb-2">{scene.title}</h1>
        {scene.subtitle && <p className="text-dim text-lg font-body mb-4">{scene.subtitle}</p>}

        <div className="flex gap-4 text-sm font-ui text-dim mb-8">
          {scene.dateApprox && <span>{scene.dateApprox}</span>}
          {scene.location && <span>{scene.location.label}</span>}
          <span className="text-gold">{scene.convergenceScore}/4 Gospels</span>
        </div>

        {/* Prophecy Links */}
        {scene.fulfillments.length > 0 && (
          <div className="mb-8 p-4 border border-prophecy/30 rounded-lg bg-[rgb(var(--prophecy)/.05)]">
            <h2 className="font-heading text-sm text-prophecy mb-2">Prophecy Fulfilled</h2>
            {scene.fulfillments.map((f) => (
              <Link
                key={f.id}
                href={`/prophecies/${f.prophecy.slug}`}
                className="block text-prophecy hover:underline text-sm font-body"
              >
                {f.prophecy.label} ({f.prophecy.reference})
              </Link>
            ))}
          </div>
        )}

        {/* Gospel Accounts */}
        {scene.accounts.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl text-parchment mb-4">Gospel Harmony</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {scene.accounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-4 bg-surface rounded-lg border-l-4 border-${account.gospel}`}
                >
                  <h3 className={`font-ui text-sm font-semibold text-${account.gospel} capitalize mb-1`}>
                    {account.gospel}
                  </h3>
                  <p className="font-ui text-xs text-dim mb-2">{account.reference}</p>
                  {account.translations.map((t) => (
                    <p key={t.id} className="text-sm font-body mt-2">
                      <span className="font-ui text-xs text-dim uppercase mr-2">{t.version}</span>
                      {t.text}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Jesus Words */}
        {scene.jesusWords.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl text-parchment mb-4">Words of Jesus</h2>
            {scene.jesusWords.map((word) => (
              <blockquote
                key={word.id}
                className="border-l-4 border-gold pl-4 py-2 mb-4 jesus-words text-lg"
              >
                &ldquo;{word.text}&rdquo;
                <cite className="block text-sm text-dim font-ui mt-1 not-italic">
                  {word.reference} {word.note && `— ${word.note}`}
                </cite>
              </blockquote>
            ))}
          </section>
        )}

        {/* Gap Notes */}
        {scene.gapNotes.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl text-parchment mb-4">Gap Analysis</h2>
            <ul className="space-y-2">
              {scene.gapNotes.map((note) => (
                <li key={note.id} className="text-sm font-body text-dim flex gap-2">
                  <span className="text-gold">•</span>
                  {note.note}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* External Sources */}
        {scene.sourceParallels.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl text-parchment mb-4">External Sources</h2>
            {scene.sourceParallels.map((sp) => (
              <div key={sp.id} className="p-3 bg-surface rounded-lg mb-2">
                <Link href={`/sources/${sp.source.category.slug}/${sp.source.slug}`} className="font-ui text-sm text-john hover:underline">
                  {sp.source.title}
                </Link>
                <span className="font-ui text-xs text-dim ml-2">{sp.source.type}</span>
                {sp.note && <p className="text-sm text-dim font-body mt-1">{sp.note}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
