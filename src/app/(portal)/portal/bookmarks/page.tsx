import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "My Bookmarks" };

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const bookmarks = await db.bookmark.findMany({
    where: { userId: session.user.id },
    include: {
      scene: { select: { slug: true, title: true, subtitle: true, dateApprox: true } },
      prophecy: { select: { slug: true, label: true, reference: true } },
      source: { select: { slug: true, title: true, type: true, category: { select: { slug: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl text-parchment mb-6">My Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dim font-body mb-4">No bookmarks yet.</p>
          <p className="text-dim font-ui text-sm">
            Click the bookmark icon on any scene, prophecy, or source to save it here.
          </p>
          <Link href="/timeline" className="inline-block mt-4 px-4 py-2 bg-[rgb(var(--gold))] text-white rounded-md font-ui text-sm">
            Explore the Timeline
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm) => {
            let href = "#";
            let title = "Unknown";
            let subtitle = "";
            let type = "bookmark";

            if (bm.scene) {
              href = `/scene/${bm.scene.slug}`;
              title = bm.scene.title;
              subtitle = bm.scene.subtitle || bm.scene.dateApprox || "";
              type = "Scene";
            } else if (bm.prophecy) {
              href = `/prophecies/${bm.prophecy.slug}`;
              title = bm.prophecy.label;
              subtitle = bm.prophecy.reference;
              type = "Prophecy";
            } else if (bm.source) {
              href = `/sources/${bm.source.category.slug}/${bm.source.slug}`;
              title = bm.source.title;
              subtitle = bm.source.type || "";
              type = "Source";
            }

            return (
              <Link
                key={bm.id}
                href={href}
                className="flex items-start gap-4 p-4 bg-surface rounded-lg border hover:border-[rgb(var(--gold))] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-ui px-2 py-0.5 rounded bg-[rgb(var(--gold)/.1)] text-gold">
                      {type}
                    </span>
                    <h3 className="font-heading text-sm text-parchment truncate">{title}</h3>
                  </div>
                  {subtitle && <p className="text-xs font-body text-dim mt-1">{subtitle}</p>}
                  {bm.note && <p className="text-xs font-body text-dim mt-1 italic">{bm.note}</p>}
                </div>
                <span className="text-[10px] font-ui text-dim shrink-0">
                  {new Date(bm.createdAt).toLocaleDateString()}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
