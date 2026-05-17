"use client";

import { formatPrice } from "@/lib/utils";
import type { ChildData } from "./RegistrationForm";

export type PaymentPlan = "DEPOSIT" | "FULL";

interface Step3PaymentProps {
  onPay: (method: "STRIPE" | "BANK_TRANSFER", plan: PaymentPlan) => void;
  onBack: () => void;
  loading: boolean;
  totalAmount: number | null;
  children: ChildData[];
  sessionName: string;
  stripeEnabled: boolean;
}

const DEPOSIT = 200;

export default function Step3Payment({ onPay, onBack, loading, totalAmount, children, sessionName, stripeEnabled }: Step3PaymentProps) {
  const full = totalAmount ?? 0;

  const plans: { plan: PaymentPlan; label: string; amount: number; badge?: string; note: string }[] = [
    {
      plan: "DEPOSIT",
      label: "Депозит сега",
      amount: DEPOSIT,
      note: `Остатъкът ${full > DEPOSIT ? formatPrice(full - DEPOSIT) : ""} е дължим до 4 седмици след подписване на договора.`,
    },
    {
      plan: "FULL",
      label: "Пълно плащане",
      amount: full,
      badge: "Препоръчано",
      note: "Еднократно плащане на цялата сума. Без допълнителни стъпки.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-cream rounded-2xl border border-forest/10 p-5">
        <h2 className="text-forest font-bold text-base mb-3">Резюме</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-moss">Сесия</span>
            <span className="text-forest font-medium">{sessionName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-moss">Деца</span>
            <span className="text-forest">{children.map((c) => `${c.firstName} ${c.lastName}`).join(", ")}</span>
          </div>
          {totalAmount && (
            <div className="flex justify-between border-t border-forest/10 pt-2 mt-1">
              <span className="text-forest font-semibold">Обща сума</span>
              <span className="text-teal font-bold">{formatPrice(totalAmount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {plans.map(({ plan, label, amount, badge, note }) => (
          <div key={plan} className="rounded-2xl border border-forest/10 bg-cream overflow-hidden">
            {/* Plan header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-forest font-bold text-sm">{label}</span>
                {badge && (
                  <span className="text-[10px] font-semibold bg-teal/15 text-teal px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-teal font-bold text-lg">{formatPrice(amount)}</span>
            </div>
            <p className="px-5 pb-3 text-moss text-xs leading-relaxed">{note}</p>

            {/* Payment method buttons */}
            <div className={`grid gap-px bg-forest/8 border-t border-forest/8 ${stripeEnabled ? "grid-cols-2" : "grid-cols-1"}`}>
              {stripeEnabled && (
                <button
                  onClick={() => onPay("STRIPE", plan)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-cream hover:bg-mint px-4 py-3.5 text-sm font-semibold text-forest transition-colors disabled:opacity-50"
                >
                  <span>💳</span> С карта
                </button>
              )}
              <button
                onClick={() => onPay("BANK_TRANSFER", plan)}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-cream hover:bg-mint px-4 py-3.5 text-sm font-semibold text-forest transition-colors disabled:opacity-50"
              >
                <span>🏦</span> Банков превод
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="w-full py-3 bg-forest/8 hover:bg-forest/15 text-moss font-medium rounded-xl text-sm transition-all"
      >
        ← Назад
      </button>

      {loading && (
        <p className="text-center text-moss/60 text-xs animate-pulse">Пренасочване...</p>
      )}
    </div>
  );
}
