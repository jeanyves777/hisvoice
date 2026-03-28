import { TopNav } from "@/components/nav/top-nav";
import { IntelligenceChat } from "./intelligence-chat";
import { db } from "@/lib/db";

export const metadata = { title: "AI Intelligence" };

export default async function IntelligencePage() {
  const [sceneCount, sourceCount, prophecyCount, wordCount] = await Promise.all([
    db.scene.count(),
    db.worldSource.count(),
    db.prophecy.count(),
    db.jesusWord.count(),
  ]);

  return (
    <>
      <TopNav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-2 text-center">
          AI Intelligence
        </h1>
        <p className="text-dim text-center font-body mb-2 max-w-xl mx-auto">
          Chat with the most knowledgeable historian of Jesus ever created.
        </p>
        <div className="flex justify-center gap-4 mb-8 text-xs font-ui text-dim">
          <span>{sceneCount} scenes</span>
          <span>&middot;</span>
          <span>{sourceCount} world sources</span>
          <span>&middot;</span>
          <span>{prophecyCount} prophecies</span>
          <span>&middot;</span>
          <span>{wordCount} words of Jesus</span>
        </div>

        <IntelligenceChat />
      </main>
    </>
  );
}
