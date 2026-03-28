"use client";

import { toast } from "sonner";

interface ShareButtonProps {
  text: string;
  reference: string;
  className?: string;
}

export function ShareButton({ text, reference, className = "" }: ShareButtonProps) {
  const handleShare = async () => {
    const formatted = `"${text}"\n— ${reference}\n\nvia His Voice`;

    if (navigator.share) {
      try {
        await navigator.share({ text: formatted });
        return;
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(formatted);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-ui text-xs text-dim border hover:border-[rgb(var(--gold))] hover:text-gold transition-colors ${className}`}
      title="Share this verse"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Share
    </button>
  );
}
