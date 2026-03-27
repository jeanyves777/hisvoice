"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Registration failed");
    } else {
      toast.success("Account created! Please sign in.");
      router.push("/auth/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl text-gold">HIS VOICE</Link>
          <p className="text-dim font-body mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-xl border space-y-4">
          <div>
            <label className="block text-sm font-ui text-dim mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border bg-primary font-ui text-sm focus:outline-none focus:ring-2 ring-gold"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-ui text-dim mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border bg-primary font-ui text-sm focus:outline-none focus:ring-2 ring-gold"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-ui text-dim mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border bg-primary font-ui text-sm focus:outline-none focus:ring-2 ring-gold"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-ui text-dim mb-1">Phone (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border bg-primary font-ui text-sm focus:outline-none focus:ring-2 ring-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[rgb(var(--gold))] text-white rounded-lg font-ui text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-dim font-ui">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
