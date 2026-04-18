"use client";

import { useState } from "react";
import type { Session, PricingTier } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import type { ChildData } from "./RegistrationForm";

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

function calcTotal(basePrice: number, count: number) {
  // 1st child: full price
  // 2nd child: 5% off
  // 3rd child: 10% off
  let total = basePrice;
  if (count >= 2) total += basePrice * 0.95;
  if (count >= 3) total += basePrice * 0.90;
  return total;
}

export default function Step1Children({ session, onNext, loading }: Step1ChildrenProps) {
  const [childCount, setChildCount] = useState(1);
  const [children, setChildren] = useState<ChildData[]>([emptyChild()]);
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<{ valid: boolean; label?: string; discountPct?: number; error?: string } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const earlyBird = session.pricingTiers.find(
    (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > new Date()
  );
  const basePrice = earlyBird?.price ?? session.pricingTiers.find((t) => t.tierType === "STANDARD")?.price ?? 0;

  const subtotal = calcTotal(basePrice, childCount);
  const promoDiscount = promoResult?.valid && promoResult.discountPct
    ? subtotal * (promoResult.discountPct / 100)
    : 0;
  const total = subtotal - promoDiscount;

  function handleCountChange(count: number) {
    setChildCount(count);
    setChildren((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array.from({ length: count - prev.length }, emptyChild)];
      }
      return prev.slice(0, count);
    });
  }

  function updateChild(i: number, field: keyof ChildData, value: string) {
    setChildren((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
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

  const inputClass = "w-full bg-linen border border-forest/15 rounded-xl px-3 py-2.5 text-forest text-sm placeholder-moss/40 focus:outline-none focus:border-teal/50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Child count selector */}
      <div className="bg-cream rounded-2xl border border-forest/10 p-6">
        <h2 className="text-forest font-bold text-base mb-4">Брой деца</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { count: 1, label: "1 дете", sub: formatPrice(basePrice) },
            { count: 2, label: "2 деца", sub: "5% отстъпка за 2-ро" },
            { count: 3, label: "3 деца", sub: "10% отстъпка за 3-то" },
          ].map(({ count, label, sub }) => (
            <button
              key={count}
              type="button"
              onClick={() => handleCountChange(count)}
              className={`flex flex-col items-center gap-1 py-4 px-3 rounded-2xl border-2 transition-all ${
                childCount === count
                  ? "border-teal bg-mint text-forest"
                  : "border-forest/10 bg-sand hover:border-teal/40 text-moss hover:text-forest"
              }`}
            >
              <span className={`text-2xl font-light ${childCount === count ? "text-teal" : "text-forest/40"}`} style={{ fontFamily: "var(--font-serif)" }}>
                {count}
              </span>
              <span className="font-semibold text-sm">{label}</span>
              <span className="text-xs opacity-70 text-center leading-tight">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Child forms */}
      <div className="bg-cream rounded-2xl border border-forest/10 p-6 space-y-6">
        <h2 className="text-forest font-bold text-base">Данни за {childCount === 1 ? "детето" : "децата"}</h2>

        {children.map((child, i) => (
          <div key={i} className={`space-y-3 ${i > 0 ? "pt-6 border-t border-forest/10" : ""}`}>
            {childCount > 1 && (
              <p className="text-teal text-xs font-semibold uppercase tracking-wide">Дете {i + 1}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-moss text-xs mb-1.5">Собствено име *</label>
                <input
                  required
                  value={child.firstName}
                  onChange={(e) => updateChild(i, "firstName", e.target.value)}
                  className={inputClass}
                  placeholder="Иван"
                />
              </div>
              <div>
                <label className="block text-moss text-xs mb-1.5">Фамилия *</label>
                <input
                  required
                  value={child.lastName}
                  onChange={(e) => updateChild(i, "lastName", e.target.value)}
                  className={inputClass}
                  placeholder="Иванов"
                />
              </div>
            </div>

            <div>
              <label className="block text-moss text-xs mb-1.5">Дата на раждане *</label>
              <input
                type="date"
                required
                value={child.dateOfBirth}
                onChange={(e) => updateChild(i, "dateOfBirth", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-moss text-xs mb-1.5">Хранителни ограничения / алергии</label>
              <input
                value={child.dietaryNotes}
                onChange={(e) => updateChild(i, "dietaryNotes", e.target.value)}
                className={inputClass}
                placeholder="Напр. вегетарианско, алергия към ядки"
              />
            </div>

            <div>
              <label className="block text-moss text-xs mb-1.5">Медицинска информация</label>
              <input
                value={child.medicalNotes}
                onChange={(e) => updateChild(i, "medicalNotes", e.target.value)}
                className={inputClass}
                placeholder="Неща, за които трябва да знаем"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Promo code */}
      <div className="bg-cream rounded-2xl border border-forest/10 p-5">
        <h3 className="text-moss text-sm font-medium mb-3">Промо код (по желание)</h3>
        <div className="flex gap-2">
          <input
            value={promoCode}
            onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoResult(null); }}
            className={`${inputClass} flex-1 uppercase`}
            placeholder="SUMMER10"
          />
          <button
            type="button"
            onClick={validatePromo}
            disabled={!promoCode || promoLoading}
            className="px-4 py-2.5 bg-forest/10 hover:bg-forest/20 disabled:opacity-40 text-forest text-sm font-medium rounded-xl transition-all"
          >
            {promoLoading ? "..." : "Приложи"}
          </button>
        </div>
        {promoResult && (
          <p className={`mt-2 text-xs ${promoResult.valid ? "text-teal" : "text-ember"}`}>
            {promoResult.valid ? `✓ ${promoResult.label} приложено` : `✗ ${promoResult.error}`}
          </p>
        )}
      </div>

      {/* Price summary */}
      <div className="bg-cream rounded-2xl border border-forest/10 p-5 space-y-2">
        {/* Row: 1st child */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-moss">1-во дете</span>
          <span className="text-forest font-medium">{formatPrice(basePrice)}</span>
        </div>

        {/* Row: 2nd child */}
        {childCount >= 2 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-moss">
              2-ро дете
              <span className="ml-1.5 text-xs bg-mint text-teal px-1.5 py-0.5 rounded-full">-5%</span>
            </span>
            <span className="text-forest font-medium">{formatPrice(basePrice * 0.95)}</span>
          </div>
        )}

        {/* Row: 3rd child */}
        {childCount >= 3 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-moss">
              3-то дете
              <span className="ml-1.5 text-xs bg-mint text-teal px-1.5 py-0.5 rounded-full">-10%</span>
            </span>
            <span className="text-forest font-medium">{formatPrice(basePrice * 0.90)}</span>
          </div>
        )}

        {/* Promo row */}
        {promoDiscount > 0 && (
          <div className="flex items-center justify-between text-sm text-teal">
            <span>Промо код ({promoResult?.label})</span>
            <span>-{formatPrice(promoDiscount)}</span>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-forest/10 pt-3 flex items-center justify-between">
          <span className="text-forest font-semibold">Обща сума</span>
          <span className="text-teal font-bold text-lg">{formatPrice(total)}</span>
        </div>
        <p className="text-moss/50 text-xs">Депозит €200 за потвърждение на място</p>
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full bg-teal hover:bg-teal-dark disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-sm"
      >
        {loading ? "Зареждане..." : "Продължи →"}
      </button>
    </form>
  );
}
