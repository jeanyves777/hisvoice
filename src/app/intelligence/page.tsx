import { TopNav } from "@/components/nav/top-nav";

export const metadata = { title: "Intelligence" };

export default function IntelligencePage() {
  return (
    <>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="font-display text-3xl text-gold mb-4">AI Intelligence</h1>
        <p className="text-dim font-body text-lg max-w-xl mx-auto">
          Chat with the most knowledgeable historian of Jesus ever created.
          Ask anything across all 70+ sources and 10 traditions.
        </p>
        <p className="text-dim font-ui text-sm mt-8">Coming in Phase 2</p>
      </main>
    </>
  );
}
