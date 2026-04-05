"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Грешен имейл или парола");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#f5a623] flex items-center justify-center text-[#0d1b2a] font-bold text-xl mx-auto mb-3">
            М
          </div>
          <h1 className="text-white font-bold text-xl">Административен панел</h1>
          <p className="text-white/40 text-sm mt-1">Мечта в джоба</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e3a52]/50 rounded-2xl border border-white/10 p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white/60 text-xs mb-1.5">Имейл</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all"
              placeholder="admin@dreaminmypocket.org"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs mb-1.5">Парола</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f5a623] hover:bg-[#f7b84a] disabled:opacity-60 text-[#0d1b2a] font-bold py-3 rounded-xl transition-all text-sm"
          >
            {loading ? "Влизане..." : "Влез"}
          </button>
        </form>
      </div>
    </div>
  );
}
