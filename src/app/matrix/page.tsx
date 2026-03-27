import { TopNav } from "@/components/nav/top-nav";

export const metadata = { title: "Universal Matrix" };

export default function MatrixPage() {
  return (
    <>
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="font-display text-3xl text-gold mb-4">The Universal Matrix</h1>
        <p className="text-dim font-body text-lg max-w-xl mx-auto">
          How every tradition in human history describes the same events of
          Jesus&apos;s life — the Rosetta Stone of cross-tradition testimony.
        </p>
        <p className="text-dim font-ui text-sm mt-8">Coming in Phase 2</p>
      </main>
    </>
  );
}
