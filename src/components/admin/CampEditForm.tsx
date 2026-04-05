"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, PricingTier } from "@prisma/client";

type SessionFull = Session & { pricingTiers: PricingTier[] };

export default function CampEditForm({ session }: { session: SessionFull }) {
  const router = useRouter();
  const [loading, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(session.name);
  const [tagline, setTagline] = useState(session.tagline ?? "");
  const [description, setDescription] = useState(session.description ?? "");
  const [status, setStatus] = useState(session.status);
  const [homepageVisible, setHomepageVisible] = useState(session.homepageVisible);
  const [spotsTaken, setSpotsTaken] = useState(session.spotsTaken);
  const [viewersNow, setViewersNow] = useState(session.viewersNow);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/admin/sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, tagline, description, status, homepageVisible, spotsTaken, viewersNow }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="bg-[#1e3a52]/50 rounded-2xl border border-white/10 p-5 space-y-4">
        <h2 className="text-white font-bold text-sm border-b border-white/10 pb-3">Основна информация</h2>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Име на сесията</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all" />
        </div>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all" />
        </div>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Описание</label>
          <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Статус</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50">
              <option value="ACTIVE">ACTIVE</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SOLD_OUT">SOLD_OUT</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Видимост на homepage</label>
            <label className="flex items-center gap-2 cursor-pointer mt-3">
              <input type="checkbox" checked={homepageVisible} onChange={(e) => setHomepageVisible(e.target.checked)} className="accent-amber-500 w-4 h-4" />
              <span className="text-white/70 text-sm">Показвай на homepage</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Записани деца</label>
            <input type="number" min={0} max={session.capacity} value={spotsTaken} onChange={(e) => setSpotsTaken(Number(e.target.value))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all" />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Разглеждащи в момента (FOMO)</label>
            <input type="number" min={0} value={viewersNow} onChange={(e) => setViewersNow(Number(e.target.value))} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all" />
          </div>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="bg-[#1e3a52]/50 rounded-2xl border border-white/10 p-5">
        <h2 className="text-white font-bold text-sm border-b border-white/10 pb-3 mb-4">Ценови категории</h2>
        <div className="space-y-3">
          {session.pricingTiers.map((tier) => (
            <div key={tier.id} className="flex items-center gap-3 text-sm">
              <span className={`w-24 shrink-0 text-xs font-medium px-2 py-1 rounded-full text-center ${tier.tierType === "EARLY_BIRD" ? "bg-[#f5a623]/15 text-[#f5a623]" : tier.tierType === "STANDARD" ? "bg-white/10 text-white/60" : "bg-red-500/10 text-red-400"}`}>
                {tier.tierType}
              </span>
              <span className="text-white font-bold">€{tier.price}</span>
              <span className="text-white/40 text-xs">{tier.label}</span>
              {tier.activeUntil && (
                <span className="text-white/30 text-xs">до {new Date(tier.activeUntil).toLocaleDateString("bg-BG")}</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-white/30 text-xs mt-3">За детайлно управление на цените → <a href="/admin/pricing" className="text-[#f5a623] hover:underline">Ценообразуване</a></p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${saved ? "bg-[#2d6a2f] text-white" : "bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a]"} disabled:opacity-50`}
      >
        {saved ? "✓ Запазено" : loading ? "Запазване..." : "Запази промените"}
      </button>
    </form>
  );
}
