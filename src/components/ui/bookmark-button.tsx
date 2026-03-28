"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface BookmarkButtonProps {
  sceneId?: string;
  prophecyId?: string;
  sourceId?: string;
  label?: string;
}

export function BookmarkButton({ sceneId, prophecyId, sourceId, label = "Bookmark" }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!session?.user) return null;

  const handleToggle = async () => {
    setLoading(true);

    if (saved) {
      // For simplicity, we don't track bookmark IDs client-side yet
      toast.info("Bookmark management coming soon");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sceneId, prophecyId, sourceId }),
    });

    setLoading(false);

    if (res.ok) {
      setSaved(true);
      toast.success("Saved to bookmarks!");
    } else {
      toast.error("Failed to bookmark");
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-ui text-xs transition-colors ${
        saved
          ? "bg-[rgb(var(--gold)/.1)] text-gold border border-[rgb(var(--gold)/.3)]"
          : "text-dim border hover:border-[rgb(var(--gold))] hover:text-gold"
      }`}
    >
      <svg className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {saved ? "Saved" : label}
    </button>
  );
}
