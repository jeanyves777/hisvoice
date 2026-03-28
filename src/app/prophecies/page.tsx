import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";
import { ProphecyBrowser } from "./prophecy-browser";

export const metadata = { title: "Prophecies" };

export default async function PropheciesPage() {
  const prophecies = await db.prophecy.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      fulfillments: {
        include: {
          scene: { select: { slug: true, title: true, dateApprox: true, convergenceScore: true } },
        },
      },
    },
  });

  const data = prophecies.map((p) => ({
    slug: p.slug,
    label: p.label,
    reference: p.reference,
    dateWritten: p.dateWritten,
    textKjv: p.textKjv,
    fulfillmentType: p.fulfillmentType,
    probabilityNote: p.probabilityNote,
    fulfillments: p.fulfillments.map((f) => ({
      sceneSlug: f.scene.slug,
      sceneTitle: f.scene.title,
      sceneDateApprox: f.scene.dateApprox,
      convergenceScore: f.scene.convergenceScore,
      note: f.note,
    })),
  }));

  const fulfilledCount = data.filter((p) => p.fulfillments.length > 0).length;

  return (
    <>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-2 text-center">
          Prophecies
        </h1>
        <p className="text-dim text-center font-body mb-2">
          {data.length} Messianic prophecies spanning 1,500+ years
        </p>
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <p className="font-ui text-2xl text-gold">{fulfilledCount}</p>
            <p className="font-ui text-xs text-dim">Fulfilled</p>
          </div>
          <div className="text-center">
            <p className="font-ui text-2xl text-prophecy">{data.length}</p>
            <p className="font-ui text-xs text-dim">Total</p>
          </div>
          <div className="text-center">
            <p className="font-ui text-2xl text-parchment">1,500+</p>
            <p className="font-ui text-xs text-dim">Years Span</p>
          </div>
        </div>
        <ProphecyBrowser prophecies={data} />
      </main>
    </>
  );
}
