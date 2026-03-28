"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchOverlay } from "@/components/ui/search-overlay";
import { NotificationBell } from "@/components/notifications/notification-bell";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchItems, setSearchItems] = useState<
    Array<{ type: "scene" | "prophecy" | "source"; slug: string; title: string; subtitle?: string; href: string }>
  >([]);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then(setSearchItems)
      .catch(() => {});
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-xl text-gold tracking-wider">
              HIS VOICE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
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
          <div className="flex items-center gap-2">
            {/* Search — hidden on small mobile */}
            <div className="hidden sm:block">
              <SearchOverlay items={searchItems} />
            </div>

            {/* Notification bell (logged in only) */}
            {session?.user && <NotificationBell />}

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-dim hover:text-gold transition-colors font-ui text-sm"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "\u2600\uFE0F" : "\u{1F319}"}
            </button>

            {/* Auth buttons — desktop */}
            <div className="hidden md:flex items-center gap-2">
              {session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-ui bg-[rgb(var(--gold))] text-white rounded-md hover:opacity-90 transition-opacity"
                  >
                    {session.user.name?.split(" ")[0] || "User"}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-surface rounded-lg border shadow-lg py-1 z-50"
                      >
                        <Link href="/portal/dashboard" className="block px-4 py-2 text-sm font-ui text-dim hover:text-parchment hover:bg-primary/50" onClick={() => setUserMenuOpen(false)}>
                          Dashboard
                        </Link>
                        <Link href="/portal/settings" className="block px-4 py-2 text-sm font-ui text-dim hover:text-parchment hover:bg-primary/50" onClick={() => setUserMenuOpen(false)}>
                          Settings
                        </Link>
                        {(session.user.role === "ADMIN" || session.user.role === "STAFF") && (
                          <Link href="/portal/admin/users" className="block px-4 py-2 text-sm font-ui text-dim hover:text-parchment hover:bg-primary/50" onClick={() => setUserMenuOpen(false)}>
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                          className="block w-full text-left px-4 py-2 text-sm font-ui text-prophecy hover:bg-primary/50"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="px-3 py-1.5 text-sm font-ui text-gold hover:underline">
                    Login
                  </Link>
                  <Link href="/auth/register" className="px-3 py-1.5 text-sm font-ui bg-[rgb(var(--gold))] text-white rounded-md hover:opacity-90 transition-opacity">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-dim hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t overflow-hidden bg-surface"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2.5 text-sm font-ui rounded-md transition-colors ${
                    pathname === link.href || pathname?.startsWith(link.href + "/")
                      ? "text-gold bg-[rgb(var(--gold)/.1)]"
                      : "text-dim hover:text-[rgb(var(--text-body))]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile search */}
              <div className="pt-2 sm:hidden">
                <SearchOverlay items={searchItems} />
              </div>

              {/* Mobile auth */}
              <div className="pt-2 border-t mt-2 md:hidden">
                {session?.user ? (
                  <Link
                    href="/portal/dashboard"
                    className="block px-3 py-2.5 text-sm font-ui text-gold"
                  >
                    Dashboard ({session.user.name?.split(" ")[0]})
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <Link href="/auth/login" className="block px-3 py-2.5 text-sm font-ui text-gold">
                      Login
                    </Link>
                    <Link href="/auth/register" className="block px-3 py-2.5 text-sm font-ui text-gold">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
