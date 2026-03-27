import { TopNav } from "@/components/nav/top-nav";

export const metadata = { title: "Curiosity Engine" };

export default function CuriosityPage() {
  return (
    <>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="font-display text-3xl text-gold mb-4">The Curiosity Engine</h1>
        <p className="text-dim font-body text-lg max-w-xl mx-auto">
          Ask the hard questions. Get a cinematic, voice-narrated,
          AI-powered journey through the evidence — from 70+ ancient sources.
        </p>
        <p className="text-dim font-ui text-sm mt-8">Coming in Phase 2</p>
      </main>
    </>
  );
}
