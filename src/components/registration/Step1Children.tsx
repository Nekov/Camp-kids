"use client";

import { useState } from "react";
import type { Session, PricingTier } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import type { ChildData } from "./RegistrationForm";
import { Plus, Minus } from "lucide-react";

type SessionWithPricing = Session & { pricingTiers: PricingTier[] };

interface Step1ChildrenProps {
  session: SessionWithPricing;
  onNext: (children: ChildData[], promoCode?: string) => void;
  loading: boolean;
}

const emptyChild = (): ChildData => ({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  dietaryNotes: "",
  medicalNotes: "",
});

export default function Step1Children({ session, onNext, loading }: Step1ChildrenProps) {
  const [children, setChildren] = useState<ChildData[]>([emptyChild()]);
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<{ valid: boolean; label?: string; error?: string } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const earlyBird = session.pricingTiers.find(
    (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > new Date()
  );
  const basePrice = earlyBird?.price ?? session.pricingTiers.find((t) => t.tierType === "STANDARD")?.price ?? 0;
  const childCount = children.length;
  let totalBeforePromo = basePrice * childCount;
  if (childCount >= 2) {
    totalBeforePromo = basePrice * 1 + basePrice * (childCount - 1) * 0.94;
  }

  function updateChild(i: number, field: keyof ChildData, value: string) {
    setChildren((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }

  function addChild() {
    if (children.length < 5) setChildren((prev) => [...prev, emptyChild()]);
  }

  function removeChild(i: number) {
    if (children.length > 1) setChildren((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function validatePromo() {
    if (!promoCode) return;
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, sessionId: session.id }),
      });
      const data = await res.json();
      setPromoResult(data);
    } finally {
      setPromoLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validCode = promoResult?.valid ? promoCode : undefined;
    onNext(children, validCode);
  }

  const isValid = children.every((c) => c.firstName && c.lastName && c.dateOfBirth);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#1e3a52]/50 rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-base">Данни за детето/децата</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => removeChild(children.length - 1)}
              disabled={children.length <= 1}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-white transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-white font-bold text-sm w-4 text-center">{childCount}</span>
            <button
              type="button"
              onClick={addChild}
              disabled={children.length >= 5}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-white transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {children.map((child, i) => (
            <div key={i} className={`space-y-3 ${i > 0 ? "pt-5 border-t border-white/10" : ""}`}>
              {children.length > 1 && (
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs font-medium">Дете {i + 1}</span>
                  {i > 0 && (
                    <button type="button" onClick={() => removeChild(i)} className="text-red-400/60 hover:text-red-400 text-xs transition-colors">
                      Премахни
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Собствено име *</label>
                  <input
                    required
                    value={child.firstName}
                    onChange={(e) => updateChild(i, "firstName", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#f5a623]/50 transition-all"
                    placeholder="Иван"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Фамилия *</label>
                  <input
                    required
                    value={child.lastName}
                    onChange={(e) => updateChild(i, "lastName", e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#f5a623]/50 transition-all"
                    placeholder="Иванов"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs mb-1.5">Дата на раждане *</label>
                <input
                  type="date"
                  required
                  value={child.dateOfBirth}
                  onChange={(e) => updateChild(i, "dateOfBirth", e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs mb-1.5">Хранителни ограничения / алергии</label>
                <input
                  value={child.dietaryNotes}
                  onChange={(e) => updateChild(i, "dietaryNotes", e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#f5a623]/50 transition-all"
                  placeholder="Напр. вегетарианско, алергия към ядки"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs mb-1.5">Медицинска информация</label>
                <input
                  value={child.medicalNotes}
                  onChange={(e) => updateChild(i, "medicalNotes", e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#f5a623]/50 transition-all"
                  placeholder="Неща, за които трябва да знаем"
                />
              </div>
            </div>
          ))}
        </div>

        {childCount >= 2 && (
          <div className="mt-4 p-3 rounded-lg bg-[#2d6a2f]/20 border border-[#2d6a2f]/30 text-emerald-400 text-xs">
            🎉 Отстъпка 6% за второто дете автоматично приложена!
          </div>
        )}
      </div>

      {/* Promo code */}
      <div className="bg-[#1e3a52]/50 rounded-2xl border border-white/10 p-5">
        <h3 className="text-white/70 text-sm font-medium mb-3">Промо код (по желание)</h3>
        <div className="flex gap-2">
          <input
            value={promoCode}
            onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoResult(null); }}
            className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#f5a623]/50 transition-all uppercase"
            placeholder="SUMMER10"
          />
          <button
            type="button"
            onClick={validatePromo}
            disabled={!promoCode || promoLoading}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-all"
          >
            {promoLoading ? "..." : "Приложи"}
          </button>
        </div>
        {promoResult && (
          <p className={`mt-2 text-xs ${promoResult.valid ? "text-emerald-400" : "text-red-400"}`}>
            {promoResult.valid ? `✓ ${promoResult.label} приложено` : `✗ ${promoResult.error}`}
          </p>
        )}
      </div>

      {/* Price summary */}
      <div className="bg-[#1e3a52]/50 rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-sm">
            {childCount} {childCount === 1 ? "дете" : "деца"} × {formatPrice(basePrice)}
          </span>
          <span className="text-white font-semibold">{formatPrice(totalBeforePromo)}</span>
        </div>
        {childCount >= 2 && (
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
            <span>Отстъпка за второ дете (6%)</span>
            <span>-{formatPrice(basePrice * 0.06)}</span>
          </div>
        )}
        <div className="border-t border-white/10 pt-2 flex items-center justify-between">
          <span className="text-white font-semibold">Обща сума</span>
          <span className="text-[#f5a623] font-bold text-lg">{formatPrice(totalBeforePromo)}</span>
        </div>
        <p className="text-white/30 text-xs mt-2">Депозит €200 за потвърждение на място</p>
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full bg-[#f5a623] hover:bg-[#f7b84a] disabled:opacity-50 text-[#0d1b2a] font-bold py-4 rounded-xl transition-all text-sm"
      >
        {loading ? "Зареждане..." : "Продължи →"}
      </button>
    </form>
  );
}
