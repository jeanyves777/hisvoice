"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Client Error]", error);

    // Report to tracking API
    fetch("/api/tracking/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "unknown",
        name: "client_error",
        properties: {
          message: error.message,
          digest: error.digest,
          path: window.location.pathname,
        },
      }),
    }).catch(() => {});
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="text-center max-w-lg">
        <p className="font-display text-4xl text-prophecy mb-4">Error</p>
        <h1 className="text-2xl font-heading text-parchment mb-4">
          Something went wrong
        </h1>
        <p className="text-dim font-body text-lg mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[rgb(var(--gold))] text-white rounded-md font-ui text-sm hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-gold text-gold rounded-md font-ui text-sm hover:bg-[rgb(var(--gold)/.1)] transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
