"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, password }),
    });

    setLoading(false);
    const data = await res.json();

    if (res.ok) {
      setDone(true);
      toast.success("Password reset successfully!");
    } else {
      toast.error(data.error || "Reset failed");
    }
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
        <div className="text-center">
          <p className="text-dim font-body mb-4">Invalid or expired reset link.</p>
          <Link href="/auth/forgot-password" className="text-gold font-ui text-sm hover:underline">
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl text-gold">HIS VOICE</Link>
          <p className="text-dim font-body mt-2">Set a new password</p>
        </div>

        {done ? (
          <div className="bg-surface p-8 rounded-xl border text-center">
            <p className="font-heading text-lg text-parchment mb-2">Password Reset</p>
            <p className="text-dim font-body text-sm mb-6">Your password has been updated.</p>
            <Link href="/auth/login" className="px-6 py-2.5 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90">
              Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-xl border space-y-4">
            <div>
              <label className="block text-sm font-ui text-dim mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border bg-primary font-ui text-sm focus:outline-none focus:ring-2 ring-gold"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-ui text-dim mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border bg-primary font-ui text-sm focus:outline-none focus:ring-2 ring-gold"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <p className="text-dim font-ui">Loading...</p>
      </div>
    }>
      <ResetForm />
    </Suspense>
  );
}
