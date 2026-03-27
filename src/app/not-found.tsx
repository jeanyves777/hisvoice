import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="text-center max-w-lg">
        <p className="font-display text-6xl text-gold mb-4">404</p>
        <h1 className="text-2xl font-heading text-parchment mb-4">
          This passage has not yet been found
        </h1>
        <p className="text-dim font-body text-lg mb-8">
          The page you are looking for may have been moved or does not exist.
          But the journey continues.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/timeline"
            className="px-6 py-3 bg-[rgb(var(--gold))] text-white rounded-md font-ui text-sm hover:opacity-90 transition-opacity"
          >
            Explore the Timeline
          </Link>
          <Link
            href="/prophecies"
            className="px-6 py-3 border border-gold text-gold rounded-md font-ui text-sm hover:bg-[rgb(var(--gold)/.1)] transition-colors"
          >
            View Prophecies
          </Link>
          <Link
            href="/"
            className="px-6 py-3 text-dim font-ui text-sm hover:text-[rgb(var(--text-body))] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
