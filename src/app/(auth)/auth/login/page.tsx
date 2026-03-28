"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push("/portal/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.svg" alt="His Voice" className="w-14 h-14 rounded-xl" />
            <span className="font-display text-3xl text-gold">HIS VOICE</span>
          </Link>
          <p className="text-dim font-body mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-xl border space-y-4">
          <div>
            <label className="block text-sm font-ui text-dim mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border bg-primary font-ui text-sm focus:outline-none focus:ring-2 ring-gold"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-ui text-dim mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4 space-y-2">
          <Link href="/auth/forgot-password" className="text-sm text-dim hover:text-gold font-ui">
            Forgot password?
          </Link>
          <p className="text-sm text-dim font-ui">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-gold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
