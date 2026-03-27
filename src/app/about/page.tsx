import { TopNav } from "@/components/nav/top-nav";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <TopNav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-gold mb-6 text-center">About His Voice</h1>
        <div className="prose prose-lg font-body text-[rgb(var(--text-body))]">
          <p>
            His Voice is a web application that presents the complete story of Jesus
            Christ — from the first prophecy spoken in the Garden of Eden through every
            recorded word He spoke, to the post-resurrection commission.
          </p>
          <p>
            It is not a Bible app. It is a living, visual, interactive harmony — a
            single cohesive journey through the most documented life in human history.
          </p>
          <h2 className="font-heading text-parchment">What Makes This Different</h2>
          <ul>
            <li>70+ sources from 10 world traditions — Gospels, Quran, Talmud, Roman historians, and more</li>
            <li>3 public domain translations side by side (KJV, WEB, ASV)</li>
            <li>24+ prophecy-to-fulfillment chains with mathematical probability analysis</li>
            <li>AI-powered Curiosity Engine for skeptics and seekers</li>
            <li>Completely free — all open-source technology</li>
          </ul>
          <h2 className="font-heading text-parchment">Built By</h2>
          <p>General Computing Solutions (GCS)</p>
        </div>
      </main>
    </>
  );
}
