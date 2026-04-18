"use client";

import { formatPrice } from "@/lib/utils";
import type { ChildData } from "./RegistrationForm";

interface Step3PaymentProps {
  onPay: (method: "STRIPE" | "BANK_TRANSFER") => void;
  onBack: () => void;
  loading: boolean;
  totalAmount: number | null;
  children: ChildData[];
  sessionName: string;
}

export default function Step3Payment({ onPay, onBack, loading, totalAmount, children, sessionName }: Step3PaymentProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-cream rounded-2xl border border-forest/10 p-5">
        <h2 className="text-white font-bold text-base mb-4">Резюме на заявката</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-moss">Сесия</span>
            <span className="text-white font-medium">{sessionName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-moss">Деца</span>
            <span className="text-white">{children.map((c) => `${c.firstName} ${c.lastName}`).join(", ")}</span>
          </div>
          {totalAmount && (
            <div className="flex justify-between border-t border-forest/10 pt-2 mt-2">
              <span className="text-white font-semibold">Обща сума</span>
              <span className="text-teal font-bold">{formatPrice(totalAmount)}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-mint border border-teal/20 text-xs text-teal">
          Сега плащате депозит €200. Остатъкът е дължим до 4 седмици след подписване на договора.
        </div>
      </div>

      {/* Payment options */}
      <div className="space-y-3">
        <h3 className="text-white font-bold text-sm">Изберете начин на плащане</h3>

        <button
          onClick={() => onPay("STRIPE")}
          disabled={loading}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-cream border border-forest/10 hover:border-[#f5a623]/40 hover:bg-[#1e3a52]/80 transition-all group text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-2xl shrink-0">
            💳
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Плащане с карта</p>
            <p className="text-moss text-xs mt-0.5">
              Платете депозита €200 сега онлайн. Сигурно, чрез Stripe.
            </p>
          </div>
          <span className="text-white/30 group-hover:text-teal transition-colors text-lg">→</span>
        </button>

        <button
          onClick={() => onPay("BANK_TRANSFER")}
          disabled={loading}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-cream border border-forest/10 hover:border-[#f5a623]/40 hover:bg-[#1e3a52]/80 transition-all group text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-2xl shrink-0">
            🏦
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Банков превод</p>
            <p className="text-moss text-xs mt-0.5">
              Ще получите банковите данни. Преведете депозита в рамките на 3 дни.
            </p>
          </div>
          <span className="text-white/30 group-hover:text-teal transition-colors text-lg">→</span>
        </button>
      </div>

      <button
        onClick={onBack}
        className="w-full py-3 bg-forest/8 hover:bg-white/15 text-moss font-medium rounded-xl text-sm transition-all"
      >
        ← Назад
      </button>

      {loading && (
        <p className="text-center text-moss/60 text-xs animate-pulse">Пренасочване...</p>
      )}
    </div>
  );
}
