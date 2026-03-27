import { requireRole } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export const metadata = { title: "Admin — System" };

export default async function AdminSystemPage() {
  await requireRole(["ADMIN"]);

  const recentErrors = await db.errorLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div>
      <h1 className="font-heading text-2xl text-parchment mb-6">System Health</h1>

      <h2 className="font-heading text-lg text-parchment mb-3">Recent Errors</h2>
      {recentErrors.length === 0 ? (
        <p className="text-dim font-ui text-sm">No errors logged.</p>
      ) : (
        <div className="space-y-2">
          {recentErrors.map((err) => (
            <div key={err.id} className="p-3 bg-surface rounded-lg border text-sm font-ui">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  err.level === "CRITICAL" ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                  err.level === "ERROR" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" :
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}>
                  {err.level}
                </span>
                <span className="text-dim text-xs">{err.source}</span>
                <span className="text-dim text-xs ml-auto">{new Date(err.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-parchment">{err.message}</p>
              {err.path && <p className="text-dim text-xs mt-1">Path: {err.path}</p>}
              {err.telegramSent && <span className="text-xs text-gold">Telegram sent</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
