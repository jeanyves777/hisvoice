import { requireRole } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export const metadata = { title: "Admin — Analytics" };

export default async function AdminAnalyticsPage() {
  await requireRole(["ADMIN"]);

  const [visitorCount, sessionCount, pageViewCount, topPages] = await Promise.all([
    db.analyticsVisitor.count(),
    db.analyticsSession.count(),
    db.analyticsPageView.count(),
    db.analyticsPageView.groupBy({
      by: ["path"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl text-parchment mb-6">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="p-4 bg-surface rounded-lg border">
          <p className="font-ui text-3xl text-gold">{visitorCount}</p>
          <p className="font-ui text-sm text-dim">Unique Visitors</p>
        </div>
        <div className="p-4 bg-surface rounded-lg border">
          <p className="font-ui text-3xl text-gold">{sessionCount}</p>
          <p className="font-ui text-sm text-dim">Sessions</p>
        </div>
        <div className="p-4 bg-surface rounded-lg border">
          <p className="font-ui text-3xl text-gold">{pageViewCount}</p>
          <p className="font-ui text-sm text-dim">Page Views</p>
        </div>
      </div>

      <h2 className="font-heading text-lg text-parchment mb-3">Top Pages</h2>
      <div className="bg-surface rounded-lg border overflow-hidden">
        <table className="w-full font-ui text-sm">
          <thead>
            <tr className="border-b text-dim text-left">
              <th className="px-4 py-3">Path</th>
              <th className="px-4 py-3 text-right">Views</th>
            </tr>
          </thead>
          <tbody>
            {topPages.map((p) => (
              <tr key={p.path} className="border-b last:border-0">
                <td className="px-4 py-3 text-parchment">{p.path}</td>
                <td className="px-4 py-3 text-right text-gold">{p._count.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
