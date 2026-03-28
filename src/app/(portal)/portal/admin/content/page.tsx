import { requireRole } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Admin — Content" };

export default async function AdminContentPage() {
  await requireRole(["ADMIN"]);

  const [acts, sceneCount, accountCount, translationCount, prophecyCount, fulfillmentCount, sourceCount, wordCount] = await Promise.all([
    db.act.findMany({
      orderBy: { number: "asc" },
      include: { _count: { select: { scenes: true } } },
    }),
    db.scene.count(),
    db.account.count(),
    db.translation.count(),
    db.prophecy.count(),
    db.fulfillment.count(),
    db.worldSource.count(),
    db.jesusWord.count(),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl text-parchment mb-6">Content Management</h1>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-8">
        {[
          { label: "Scenes", value: sceneCount },
          { label: "Gospel Accounts", value: accountCount },
          { label: "Translations", value: translationCount },
          { label: "Jesus Words", value: wordCount },
          { label: "Prophecies", value: prophecyCount },
          { label: "Fulfillment Links", value: fulfillmentCount },
          { label: "World Sources", value: sourceCount },
          { label: "Coverage", value: `${Math.round((translationCount / (accountCount * 3)) * 100)}%` },
        ].map((stat) => (
          <div key={stat.label} className="p-3 bg-surface rounded-lg border text-center">
            <p className="font-ui text-xl text-gold">{stat.value}</p>
            <p className="font-ui text-xs text-dim">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Acts overview */}
      <h2 className="font-heading text-lg text-parchment mb-3">Acts & Scenes</h2>
      <div className="bg-surface rounded-lg border overflow-hidden mb-8">
        <table className="w-full font-ui text-sm">
          <thead>
            <tr className="border-b text-dim text-left">
              <th className="px-4 py-3">Act</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Time Range</th>
              <th className="px-4 py-3 text-right">Scenes</th>
            </tr>
          </thead>
          <tbody>
            {acts.map((act) => (
              <tr key={act.id} className="border-b last:border-0 hover:bg-primary/50">
                <td className="px-4 py-3 text-gold font-semibold">{act.number}</td>
                <td className="px-4 py-3 text-parchment">{act.title} — {act.subtitle}</td>
                <td className="px-4 py-3 text-dim">{act.timeRange}</td>
                <td className="px-4 py-3 text-right text-gold">{act._count.scenes}</td>
              </tr>
            ))}
            <tr className="bg-primary/30">
              <td colSpan={3} className="px-4 py-3 font-semibold text-parchment">Total</td>
              <td className="px-4 py-3 text-right font-semibold text-gold">{sceneCount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quick actions */}
      <h2 className="font-heading text-lg text-parchment mb-3">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/timeline" className="p-4 bg-surface rounded-lg border hover:border-gold transition-colors text-center">
          <p className="font-ui text-sm text-parchment">View Timeline</p>
          <p className="font-ui text-xs text-dim mt-1">See all scenes as users see them</p>
        </Link>
        <Link href="/prophecies" className="p-4 bg-surface rounded-lg border hover:border-gold transition-colors text-center">
          <p className="font-ui text-sm text-parchment">View Prophecies</p>
          <p className="font-ui text-xs text-dim mt-1">{prophecyCount} prophecies with {fulfillmentCount} links</p>
        </Link>
        <Link href="/sources" className="p-4 bg-surface rounded-lg border hover:border-gold transition-colors text-center">
          <p className="font-ui text-sm text-parchment">View Sources</p>
          <p className="font-ui text-xs text-dim mt-1">{sourceCount} world sources across 10 traditions</p>
        </Link>
      </div>
    </div>
  );
}
