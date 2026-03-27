import Link from "next/link";
import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";

export const metadata = { title: "Prophecies" };

export default async function PropheciesPage() {
  const prophecies = await db.prophecy.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      fulfillments: { include: { scene: { select: { slug: true, title: true } } } },
    },
  });

  return (
    <>
      <TopNav />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-2 text-center">Prophecies</h1>
        <p className="text-dim text-center font-body mb-10">
          {prophecies.length} Messianic prophecies spanning 1,500+ years — all fulfilled
        </p>

        <div className="space-y-4">
          {prophecies.map((p) => (
            <Link
              key={p.id}
              href={`/prophecies/${p.slug}`}
              className="block p-4 bg-surface rounded-lg border hover:border-prophecy transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-sm text-parchment group-hover:text-prophecy transition-colors">
                    {p.label}
                  </h2>
                  <p className="font-ui text-xs text-dim mt-1">{p.reference} ({p.dateWritten})</p>
                  {p.fulfillments.length > 0 && (
                    <p className="text-xs text-gold font-ui mt-2">
                      Fulfilled in: {p.fulfillments.map((f) => f.scene.title).join(", ")}
                    </p>
                  )}
                </div>
                {p.fulfillmentType && (
                  <span className="text-xs font-ui px-2 py-1 rounded bg-[rgb(var(--prophecy)/.1)] text-prophecy whitespace-nowrap">
                    {p.fulfillmentType}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {prophecies.length === 0 && (
          <p className="text-center text-dim py-20">
            No prophecies found. Run <code className="font-ui text-sm bg-surface px-2 py-1 rounded">npm run db:seed</code> to populate.
          </p>
        )}
      </main>
    </>
  );
}
