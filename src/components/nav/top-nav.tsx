"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SearchOverlay } from "@/components/ui/search-overlay";

const NAV_LINKS = [
  { href: "/timeline", label: "Timeline" },
  { href: "/prophecies", label: "Prophecies" },
  { href: "/sources", label: "Sources" },
  { href: "/matrix", label: "Matrix" },
  { href: "/curiosity", label: "Curiosity" },
  { href: "/about", label: "About" },
];

export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [searchItems, setSearchItems] = useState<Array<{ type: "scene" | "prophecy" | "source"; slug: string; title: string; subtitle?: string; href: string }>>([]);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then(setSearchItems)
      .catch(() => {});
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl text-gold tracking-wider">
              HIS VOICE
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-ui rounded-md transition-colors ${
                  pathname === link.href || pathname?.startsWith(link.href + "/")
                    ? "text-gold bg-[rgb(var(--gold)/.1)]"
                    : "text-dim hover:text-[rgb(var(--text-body))] hover:bg-[rgb(var(--bg-surface))]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <SearchOverlay items={searchItems} />

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-dim hover:text-gold transition-colors font-ui text-sm"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "\u2600\uFE0F" : "\u{1F319}"}
            </button>

            {/* Auth */}
            {session?.user ? (
              <Link
                href="/portal/dashboard"
                className="px-3 py-1.5 text-sm font-ui bg-[rgb(var(--gold))] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                {session.user.name?.split(" ")[0] || "Dashboard"}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-sm font-ui text-gold hover:underline"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 text-sm font-ui bg-[rgb(var(--gold))] text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
