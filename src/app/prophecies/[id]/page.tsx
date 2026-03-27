import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const prophecy = await db.prophecy.findUnique({
    where: { slug: params.id },
    select: { label: true, reference: true },
  });
  if (!prophecy) return { title: "Prophecy Not Found" };
  return { title: `${prophecy.label} — ${prophecy.reference}` };
}

export default async function ProphecyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const prophecy = await db.prophecy.findUnique({
    where: { slug: params.id },
    include: {
      fulfillments: {
        include: {
          scene: {
            select: { slug: true, title: true, dateApprox: true, act: { select: { title: true, number: true } } },
          },
        },
      },
    },
  });

  if (!prophecy) notFound();

  return (
    <>
      <TopNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm font-ui text-dim mb-6">
          <Link href="/prophecies" className="hover:text-gold transition-colors">Prophecies</Link>
          <span className="text-dim/50">/</span>
          <span className="text-parchment">{prophecy.reference}</span>
        </div>

        <h1 className="font-heading text-2xl text-parchment mb-2">{prophecy.label}</h1>
        <p className="font-ui text-sm text-dim mb-1">{prophecy.reference} ({prophecy.dateWritten})</p>

        {prophecy.fulfillmentType && (
          <span className="inline-block text-xs font-ui px-2 py-1 rounded bg-[rgb(var(--prophecy)/.1)] text-prophecy mt-2">
            {prophecy.fulfillmentType}
          </span>
        )}

        {/* Prophecy Text */}
        <div className="mt-8 p-6 bg-surface rounded-lg border">
          <h2 className="font-heading text-sm text-gold mb-3">Original Prophecy (KJV)</h2>
          <blockquote className="font-body text-lg leading-relaxed italic border-l-4 border-[rgb(var(--prophecy))] pl-4">
            {prophecy.textKjv}
          </blockquote>
          <p className="font-ui text-xs text-dim mt-3">{prophecy.reference}</p>
        </div>

        {prophecy.probabilityNote && (
          <div className="mt-4 p-4 bg-[rgb(var(--gold)/.05)] rounded-lg border border-[rgb(var(--gold)/.2)]">
            <p className="font-ui text-sm text-gold">Probability of coincidence: {prophecy.probabilityNote}</p>
          </div>
        )}

        {/* Fulfillment Links */}
        {prophecy.fulfillments.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading text-lg text-parchment mb-4">Fulfilled In</h2>
            <div className="space-y-3">
              {prophecy.fulfillments.map((f) => (
                <Link
                  key={f.id}
                  href={`/scene/${f.scene.slug}`}
                  className="block p-4 bg-surface rounded-lg border hover:border-gold transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-ui text-dim">Act {f.scene.act.number}</span>
                    <h3 className="font-heading text-sm text-parchment">{f.scene.title}</h3>
                  </div>
                  {f.scene.dateApprox && (
                    <p className="text-xs font-ui text-dim mt-1">{f.scene.dateApprox}</p>
                  )}
                  {f.note && (
                    <p className="text-sm font-body text-dim mt-2">{f.note}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
