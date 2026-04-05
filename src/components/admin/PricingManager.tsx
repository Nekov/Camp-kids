"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, PricingTier } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

type SessionWithTiers = Session & { pricingTiers: PricingTier[] };

const TIER_LABELS: Record<string, string> = {
  EARLY_BIRD: "Ранна птичка",
  STANDARD: "Стандартна",
  LAST_MINUTE: "Last Minute",
  CUSTOM: "Специална",
};

export default function PricingManager({ sessions }: { sessions: SessionWithTiers[] }) {
  const router = useRouter();
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(sessions.flatMap((s) => s.pricingTiers.map((t) => [t.id, t.price])))
  );
  const [saving, setSaving] = useState<string | null>(null);

  async function saveTier(tierId: string) {
    setSaving(tierId);
    await fetch(`/api/admin/pricing/${tierId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: prices[tierId] }),
    });
    setSaving(null);
    setEditingTier(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div key={session.id} className="bg-[#1e3a52]/30 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white font-bold text-sm">{session.name}</h3>
            <span className="text-white/40 text-xs">{session.minAge}–{session.maxAge} г.</span>
          </div>
          <div className="p-4 space-y-2">
            {session.pricingTiers.map((tier) => {
              const isEditing = editingTier === tier.id;
              return (
                <div key={tier.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 border border-white/5">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full w-28 text-center ${
                    tier.tierType === "EARLY_BIRD" ? "bg-[#f5a623]/15 text-[#f5a623]" :
                    tier.tierType === "STANDARD" ? "bg-white/10 text-white/60" :
                    tier.tierType === "LAST_MINUTE" ? "bg-red-500/10 text-red-400" :
                    "bg-purple-500/10 text-purple-400"
                  }`}>
                    {TIER_LABELS[tier.tierType] ?? tier.tierType}
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-sm">€</span>
                      <input
                        type="number"
                        value={prices[tier.id]}
                        onChange={(e) => setPrices((p) => ({ ...p, [tier.id]: Number(e.target.value) }))}
                        className="w-20 bg-white/10 border border-[#f5a623]/50 rounded-lg px-2 py-1 text-white text-sm focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveTier(tier.id)} disabled={saving === tier.id} className="text-emerald-400 hover:text-emerald-300 text-xs font-medium px-2 py-1 bg-emerald-500/10 rounded-lg">
                        {saving === tier.id ? "..." : "Запази"}
                      </button>
                      <button onClick={() => { setEditingTier(null); setPrices((p) => ({ ...p, [tier.id]: tier.price })); }} className="text-white/40 text-xs px-2 py-1">
                        Отказ
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-white font-bold text-sm flex-1">{formatPrice(prices[tier.id])}</span>
                      {tier.activeUntil && (
                        <span className="text-white/30 text-xs">до {new Date(tier.activeUntil).toLocaleDateString("bg-BG")}</span>
                      )}
                      {tier.activateWhenSpotsBelow && (
                        <span className="text-white/30 text-xs">активира при &lt;{tier.activateWhenSpotsBelow} места</span>
                      )}
                      <button
                        onClick={() => setEditingTier(tier.id)}
                        className="text-white/30 hover:text-[#f5a623] text-xs transition-colors"
                      >
                        ✏️ Редактирай
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
