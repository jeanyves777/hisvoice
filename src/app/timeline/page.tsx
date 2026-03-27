import Link from "next/link";
import { db } from "@/lib/db";
import { TopNav } from "@/components/nav/top-nav";

const ERA_COLORS: Record<string, string> = {
  prophecy: "text-prophecy",
  nativity: "text-luke",
  preparation: "text-matthew",
  galilean: "text-john",
  confrontation: "text-mark",
  passion: "text-prophecy",
  resurrection: "text-gold-bright",
};

export const metadata = { title: "Timeline" };

export default async function TimelinePage() {
  const acts = await db.act.findMany({
    include: {
      scenes: {
        orderBy: { sortOrder: "asc" },
        include: { location: true },
      },
    },
    orderBy: { number: "asc" },
  });

  return (
    <>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-2 text-center">
          The Journey
        </h1>
        <p className="text-dim text-center font-body mb-10">
          From the first prophecy to the resurrection — every event, every word
        </p>

        <div className="space-y-12">
          {acts.map((act) => (
            <section key={act.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-ui text-xs text-dim uppercase tracking-wider">
                  Act {act.number}
                </span>
                <h2 className="font-heading text-xl text-parchment">
                  {act.title}
                </h2>
                <span className="text-dim text-sm font-body">
                  — {act.subtitle}
                </span>
              </div>
              <p className="text-dim text-sm font-ui mb-4">{act.timeRange}</p>

              {act.scenes.length === 0 ? (
                <p className="text-dim text-sm italic">
                  Scenes coming soon...
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {act.scenes.map((scene) => (
                    <Link
                      key={scene.id}
                      href={`/scene/${scene.slug}`}
                      className="block p-4 bg-surface rounded-lg border hover:border-gold transition-colors group"
                    >
                      <h3 className="font-heading text-sm text-parchment group-hover:text-gold transition-colors">
                        {scene.title}
                      </h3>
                      {scene.subtitle && (
                        <p className="text-dim text-xs mt-1 font-body">
                          {scene.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {scene.dateApprox && (
                          <span className="text-xs font-ui text-dim">
                            {scene.dateApprox}
                          </span>
                        )}
                        {scene.convergenceScore > 0 && (
                          <span className="text-xs font-ui text-gold">
                            {scene.convergenceScore}/4 Gospels
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {acts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-dim text-lg">
              No acts found. Run <code className="font-ui text-sm bg-surface px-2 py-1 rounded">npm run db:seed</code> to populate the database.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
