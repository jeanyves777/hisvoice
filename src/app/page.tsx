import Link from "next/link";
import { TopNav } from "@/components/nav/top-nav";
import { AnalyticsTracker } from "@/components/tracking/analytics-tracker";

export default function HomePage() {
  return (
    <>
      <AnalyticsTracker />
      <TopNav />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl sm:text-7xl text-gold mb-6 tracking-wider">
            HIS VOICE
          </h1>
          <p className="font-heading text-xl sm:text-2xl text-parchment mb-4">
            Every Word He Spoke
          </p>
          <p className="text-dim text-lg mb-12 font-body">
            From the first promise to the last word — the most comprehensive
            interactive harmony of Jesus Christ across all world traditions.
          </p>
          <Link
            href="/timeline"
            className="inline-block px-8 py-4 bg-[rgb(var(--gold))] text-white rounded-lg font-heading text-lg tracking-wide hover:opacity-90 transition-opacity"
          >
            BEGIN THE JOURNEY
          </Link>
          <p className="mt-8 text-dim text-sm font-body italic">
            &ldquo;In the beginning was the Word, and the Word was with God,
            and the Word was God.&rdquo;
          </p>
          <p className="text-dim text-xs font-ui mt-1">
            &mdash; John 1:1
          </p>
        </div>
      </main>
    </>
  );
}
