import { requireRole } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { isOllamaAvailable, listModels } from "@/lib/ai/ollama";
import { getDatabaseStats } from "@/lib/ai/tools";

export const metadata = { title: "Admin — System" };

export default async function AdminSystemPage() {
  await requireRole(["ADMIN"]);

  const [recentErrors, ollamaUp, ollamaModels, dbStats] = await Promise.all([
    db.errorLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    isOllamaAvailable(),
    listModels(),
    getDatabaseStats(),
  ]);

  const stats = dbStats.data as Record<string, number>;

  return (
    <div>
      <h1 className="font-heading text-2xl text-parchment mb-6">System Health</h1>

      {/* Service Status */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="p-4 bg-surface rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${ollamaUp ? "bg-green-500" : "bg-red-500"}`} />
            <span className="font-ui text-sm text-parchment">Ollama AI</span>
          </div>
          <p className="font-ui text-xs text-dim">
            {ollamaUp ? `Online — ${ollamaModels.length} model${ollamaModels.length !== 1 ? "s" : ""}` : "Offline — connect VPS"}
          </p>
          {ollamaUp && ollamaModels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {ollamaModels.map((m) => (
                <span key={m} className="text-[10px] font-ui px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-surface rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="font-ui text-sm text-parchment">Database</span>
          </div>
          <p className="font-ui text-xs text-dim">SQLite — {stats.scenes} scenes, {stats.translations} translations</p>
        </div>

        <div className="p-4 bg-surface rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${process.env.TELEGRAM_BOT_TOKEN ? "bg-green-500" : "bg-yellow-500"}`} />
            <span className="font-ui text-sm text-parchment">Telegram Alerts</span>
          </div>
          <p className="font-ui text-xs text-dim">
            {process.env.TELEGRAM_BOT_TOKEN ? "Configured" : "Not configured"}
          </p>
        </div>

        <div className="p-4 bg-surface rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${process.env.SMTP_HOST ? "bg-green-500" : "bg-yellow-500"}`} />
            <span className="font-ui text-sm text-parchment">Email (SMTP)</span>
          </div>
          <p className="font-ui text-xs text-dim">
            {process.env.SMTP_HOST ? `${process.env.SMTP_HOST}` : "Not configured"}
          </p>
        </div>
      </div>

      {/* Database Stats */}
      <h2 className="font-heading text-lg text-parchment mb-3">Database Statistics</h2>
      <div className="grid gap-2 grid-cols-3 sm:grid-cols-5 mb-8">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="p-3 bg-surface rounded-lg border text-center">
            <p className="font-ui text-lg text-gold">{value}</p>
            <p className="font-ui text-[10px] text-dim capitalize">{key}</p>
          </div>
        ))}
      </div>

      {/* Environment */}
      <h2 className="font-heading text-lg text-parchment mb-3">Environment</h2>
      <div className="bg-surface rounded-lg border p-4 mb-8 font-ui text-xs space-y-1">
        <p><span className="text-dim">Node:</span> <span className="text-parchment">{process.version}</span></p>
        <p><span className="text-dim">Ollama URL:</span> <span className="text-parchment">{process.env.OLLAMA_URL || "http://localhost:11434"}</span></p>
        <p><span className="text-dim">Ollama Model:</span> <span className="text-parchment">{process.env.OLLAMA_MODEL || "llama3.1"}</span></p>
        <p><span className="text-dim">DB:</span> <span className="text-parchment">{process.env.DATABASE_URL?.startsWith("file:") ? "SQLite (local)" : "PostgreSQL"}</span></p>
      </div>

      {/* Recent Errors */}
      <h2 className="font-heading text-lg text-parchment mb-3">Recent Errors ({recentErrors.length})</h2>
      {recentErrors.length === 0 ? (
        <p className="text-dim font-ui text-sm p-4 bg-surface rounded-lg border">No errors logged. System is clean.</p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
