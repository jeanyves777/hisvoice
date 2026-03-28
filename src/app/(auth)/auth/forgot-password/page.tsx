"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSent(true);
      toast.success("If an account exists, a reset link has been sent.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl text-gold">HIS VOICE</Link>
          <p className="text-dim font-body mt-2">Reset your password</p>
        </div>

        {sent ? (
          <div className="bg-surface p-8 rounded-xl border text-center">
            <p className="font-heading text-lg text-parchment mb-2">Check your email</p>
            <p className="text-dim font-body text-sm mb-6">
              If an account exists for {email}, we&apos;ve sent a password reset link.
            </p>
            <Link href="/auth/login" className="text-sm font-ui text-gold hover:underline">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-xl border space-y-4">
            <div>
              <label className="block text-sm font-ui text-dim mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border bg-primary font-ui text-sm focus:outline-none focus:ring-2 ring-gold"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center mt-4 text-sm text-dim font-ui">
          <Link href="/auth/login" className="text-gold hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
