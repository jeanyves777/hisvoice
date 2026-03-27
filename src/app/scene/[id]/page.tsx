import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";
import { ConvergenceBadge } from "@/components/ui/convergence-badge";
import { SceneTabs } from "./scene-tabs";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const scene = await db.scene.findUnique({
    where: { slug: params.id },
    select: { title: true, subtitle: true },
  });
  if (!scene) return { title: "Scene Not Found" };
  return { title: scene.title, description: scene.subtitle };
}

export default async function ScenePage({
  params,
}: {
  params: { id: string };
}) {
  const scene = await db.scene.findUnique({
    where: { slug: params.id },
    include: {
      act: true,
      accounts: {
        include: { translations: true },
        orderBy: { sortOrder: "asc" },
      },
      jesusWords: { orderBy: { sortOrder: "asc" } },
      gapNotes: { orderBy: { sortOrder: "asc" } },
      fulfillments: { include: { prophecy: true } },
      sourceParallels: {
        include: { source: { include: { category: true } } },
      },
      location: true,
    },
  });

  if (!scene) notFound();

  const gospels = scene.accounts.map((a) => a.gospel);

  return (
    <>
      <TopNav />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-ui text-dim mb-6">
          <Link href="/timeline" className="hover:text-gold transition-colors">
            Timeline
          </Link>
          <span className="text-dim/50">/</span>
          <Link
            href={`/timeline?act=${scene.act.number}`}
            className="hover:text-gold transition-colors"
          >
            Act {scene.act.number}: {scene.act.title}
          </Link>
          <span className="text-dim/50">/</span>
          <span className="text-parchment">{scene.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-parchment mb-2">
            {scene.title}
          </h1>
          {scene.subtitle && (
            <p className="text-dim text-lg font-body">{scene.subtitle}</p>
          )}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {scene.dateApprox && (
              <span className="font-ui text-sm text-dim">{scene.dateApprox}</span>
            )}
            {scene.location && (
              <span className="font-ui text-sm text-dim">
                {scene.location.label}
              </span>
            )}
            <ConvergenceBadge
              score={scene.convergenceScore}
              gospels={gospels}
              size="md"
            />
            <span className="font-ui text-xs text-gold">
              {scene.convergenceScore}/4 Gospels
            </span>
          </div>
        </div>

        {/* Prophecy Links */}
        {scene.fulfillments.length > 0 && (
          <div className="mb-6 p-4 border border-[rgb(var(--prophecy)/.3)] rounded-lg bg-[rgb(var(--prophecy)/.05)]">
            <h2 className="font-heading text-sm text-prophecy mb-2">
              Prophecy Fulfilled
            </h2>
            <div className="space-y-1">
              {scene.fulfillments.map((f) => (
                <Link
                  key={f.id}
                  href={`/prophecies/${f.prophecy.slug}`}
                  className="block text-prophecy hover:underline text-sm font-body"
                >
                  {f.prophecy.label} — {f.prophecy.reference}
                  {f.note && (
                    <span className="text-dim text-xs ml-2">({f.note})</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tabbed Content */}
        <SceneTabs
          accounts={scene.accounts.map((a) => ({
            id: a.id,
            gospel: a.gospel,
            reference: a.reference,
            translations: a.translations.map((t) => ({
              version: t.version,
              text: t.text,
            })),
          }))}
          jesusWords={scene.jesusWords.map((w) => ({
            text: w.text,
            reference: w.reference,
            note: w.note,
          }))}
          gapNotes={scene.gapNotes.map((n) => n.note)}
          sourceParallels={scene.sourceParallels.map((sp) => ({
            sourceTitle: sp.source.title,
            sourceType: sp.source.type,
            categorySlug: sp.source.category.slug,
            sourceSlug: sp.source.slug,
            note: sp.note,
          }))}
        />
      </main>
    </>
  );
}
