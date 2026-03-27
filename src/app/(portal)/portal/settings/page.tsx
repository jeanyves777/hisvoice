"use client";

import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { selectedTranslation, setTranslation, language, setLanguage } = useAppStore();

  return (
    <div>
      <h1 className="font-heading text-2xl text-parchment mb-6">Settings</h1>

      <div className="space-y-8 max-w-lg">
        {/* Profile */}
        <section className="bg-surface p-6 rounded-lg border">
          <h2 className="font-heading text-sm text-gold mb-4">Profile</h2>
          <div className="space-y-3 font-ui text-sm">
            <div>
              <span className="text-dim">Name:</span>{" "}
              <span className="text-parchment">{session?.user?.name}</span>
            </div>
            <div>
              <span className="text-dim">Email:</span>{" "}
              <span className="text-parchment">{session?.user?.email}</span>
            </div>
            <div>
              <span className="text-dim">Role:</span>{" "}
              <span className="text-gold">{session?.user?.role}</span>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-surface p-6 rounded-lg border">
          <h2 className="font-heading text-sm text-gold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-ui text-dim mb-2">Theme</label>
              <div className="flex gap-2">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); toast.success(`Switched to ${t} theme`); }}
                    className={`px-4 py-2 rounded font-ui text-sm capitalize ${
                      theme === t
                        ? "bg-[rgb(var(--gold))] text-white"
                        : "border text-dim hover:border-[rgb(var(--gold))]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reading Preferences */}
        <section className="bg-surface p-6 rounded-lg border">
          <h2 className="font-heading text-sm text-gold mb-4">Reading Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-ui text-dim mb-2">Default Translation</label>
              <div className="flex gap-2">
                {(["kjv", "web", "asv"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTranslation(t); toast.success(`Default translation: ${t.toUpperCase()}`); }}
                    className={`px-4 py-2 rounded font-ui text-sm uppercase ${
                      selectedTranslation === t
                        ? "bg-[rgb(var(--gold))] text-white"
                        : "border text-dim hover:border-[rgb(var(--gold))]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-ui text-dim mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => { setLanguage(e.target.value); toast.success(`Language: ${e.target.value}`); }}
                className="px-4 py-2 rounded border bg-primary font-ui text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="pt">Portuguese</option>
                <option value="ar">Arabic</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
