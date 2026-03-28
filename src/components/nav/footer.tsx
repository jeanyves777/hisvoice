import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icon.svg" alt="His Voice" className="w-7 h-7 rounded" />
              <span className="font-display text-lg text-gold">HIS VOICE</span>
            </Link>
            <p className="text-dim font-body text-xs mt-2 leading-relaxed">
              The most comprehensive interactive harmony of Jesus Christ
              across all world traditions. 70+ sources. 10 civilizations.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="font-heading text-xs text-parchment mb-3">Explore</p>
            <div className="space-y-1.5">
              <Link href="/timeline" className="block text-xs font-ui text-dim hover:text-gold transition-colors">Timeline</Link>
              <Link href="/prophecies" className="block text-xs font-ui text-dim hover:text-gold transition-colors">Prophecies</Link>
              <Link href="/sources" className="block text-xs font-ui text-dim hover:text-gold transition-colors">World Sources</Link>
              <Link href="/matrix" className="block text-xs font-ui text-dim hover:text-gold transition-colors">Universal Matrix</Link>
            </div>
          </div>

          {/* Engage */}
          <div>
            <p className="font-heading text-xs text-parchment mb-3">Engage</p>
            <div className="space-y-1.5">
              <Link href="/curiosity" className="block text-xs font-ui text-dim hover:text-gold transition-colors">Curiosity Engine</Link>
              <Link href="/intelligence" className="block text-xs font-ui text-dim hover:text-gold transition-colors">AI Intelligence</Link>
              <Link href="/about" className="block text-xs font-ui text-dim hover:text-gold transition-colors">About</Link>
            </div>
          </div>

          {/* Data */}
          <div>
            <p className="font-heading text-xs text-parchment mb-3">By the Numbers</p>
            <div className="space-y-1 text-xs font-ui text-dim">
              <p>67 scenes across 7 Acts</p>
              <p>78 recorded words of Jesus</p>
              <p>24 Messianic prophecies</p>
              <p>40 world sources</p>
              <p>10 civilizations</p>
              <p>3 Bible translations (100%)</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-ui text-dim">
            Built by General Computing Solutions (GCS) &middot; All scripture public domain (KJV, WEB, ASV)
          </p>
          <p className="text-[10px] font-ui text-dim italic">
            &ldquo;Heaven and earth shall pass away, but my words shall not pass away.&rdquo; — Matthew 24:35
          </p>
        </div>
      </div>
    </footer>
  );
}
