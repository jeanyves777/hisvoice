import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  const [bookmarkCount, notifCount, sceneCount, historyItems, recentBookmarks] = await Promise.all([
    db.bookmark.count({ where: { userId: user?.id } }),
    db.notification.count({ where: { userId: user?.id, readAt: null } }),
    db.scene.count(),
    db.explorationHistory.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.bookmark.findMany({
      where: { userId: user?.id },
      include: {
        scene: { select: { slug: true, title: true } },
        prophecy: { select: { slug: true, label: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl text-parchment mb-2">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-dim font-ui text-sm mb-6">Your journey through the most documented life in history</p>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-8">
        <Link href="/portal/bookmarks" className="p-4 bg-surface rounded-lg border hover:border-[rgb(var(--gold))] transition-colors">
          <p className="font-ui text-2xl text-gold">{bookmarkCount}</p>
          <p className="font-ui text-xs text-dim">Bookmarks</p>
        </Link>
        <div className="p-4 bg-surface rounded-lg border">
          <p className="font-ui text-2xl text-gold">{notifCount}</p>
          <p className="font-ui text-xs text-dim">Unread</p>
        </div>
        <div className="p-4 bg-surface rounded-lg border">
          <p className="font-ui text-2xl text-gold">{historyItems.length}</p>
          <p className="font-ui text-xs text-dim">Pages Visited</p>
        </div>
        <Link href="/timeline" className="p-4 bg-surface rounded-lg border hover:border-[rgb(var(--gold))] transition-colors">
          <p className="font-ui text-2xl text-gold">{sceneCount}</p>
          <p className="font-ui text-xs text-dim">Scenes to Explore</p>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <div>
          <h2 className="font-heading text-sm text-parchment mb-3">Quick Actions</h2>
          <div className="grid gap-2 grid-cols-2">
            <Link href="/timeline" className="p-3 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm text-center hover:opacity-90">
              Continue Journey
            </Link>
            <Link href="/curiosity" className="p-3 border border-gold text-gold rounded-lg font-ui text-sm text-center hover:bg-[rgb(var(--gold)/.05)]">
              Ask a Question
            </Link>
            <Link href="/prophecies" className="p-3 border text-dim rounded-lg font-ui text-sm text-center hover:border-[rgb(var(--gold))]">
              Prophecies
            </Link>
            <Link href="/matrix" className="p-3 border text-dim rounded-lg font-ui text-sm text-center hover:border-[rgb(var(--gold))]">
              Universal Matrix
            </Link>
          </div>

          {(user?.role === "ADMIN" || user?.role === "STAFF") && (
            <Link
              href="/portal/admin/users"
              className="block mt-3 p-3 border text-dim rounded-lg font-ui text-sm text-center hover:border-[rgb(var(--gold))]"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* Recent bookmarks */}
        <div>
          <h2 className="font-heading text-sm text-parchment mb-3">Recent Bookmarks</h2>
          {recentBookmarks.length === 0 ? (
            <p className="text-dim font-body text-sm p-4 bg-surface rounded-lg border">
              No bookmarks yet. Save scenes and prophecies as you explore.
            </p>
          ) : (
            <div className="space-y-2">
              {recentBookmarks.map((bm) => {
                const href = bm.scene
                  ? `/scene/${bm.scene.slug}`
                  : bm.prophecy
                    ? `/prophecies/${bm.prophecy.slug}`
                    : "#";
                const title = bm.scene?.title || bm.prophecy?.label || "Bookmark";

                return (
                  <Link
                    key={bm.id}
                    href={href}
                    className="flex items-center gap-3 p-3 bg-surface rounded-lg border hover:border-[rgb(var(--gold))] transition-colors"
                  >
                    <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="font-heading text-xs text-parchment truncate">{title}</span>
                  </Link>
                );
              })}
              <Link href="/portal/bookmarks" className="block text-xs font-ui text-gold hover:underline mt-2">
                View all bookmarks →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent history */}
      {historyItems.length > 0 && (
        <div className="mt-8">
          <h2 className="font-heading text-sm text-parchment mb-3">Recent Activity</h2>
          <div className="flex flex-wrap gap-2">
            {historyItems.map((h) => (
              <Link
                key={h.id}
                href={h.path}
                className="text-xs font-ui px-3 py-1.5 bg-surface border rounded-full text-dim hover:text-gold hover:border-[rgb(var(--gold))] transition-colors"
              >
                {h.title || h.path}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
