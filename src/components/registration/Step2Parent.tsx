"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface Step2ParentProps {
  onNext: (data: {
    parentName: string;
    email: string;
    phone: string;
    attribution?: string;
    notes?: string;
  }) => void;
  onBack: () => void;
  loading: boolean;
  isFlowB: boolean;
  totalAmount: number | null;
  childCount: number;
}

export default function Step2Parent({ onNext, onBack, loading, isFlowB, totalAmount }: Step2ParentProps) {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attribution, setAttribution] = useState("");
  const [notes, setNotes] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({ parentName, email, phone, attribution, notes });
  }

  const isValid = parentName && email && phone && agreeToTerms;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#1e3a52]/50 rounded-2xl border border-white/10 p-6 space-y-4">
        <h2 className="text-white font-bold text-base mb-1">Данни за родителя / настойника</h2>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Пълно име *</label>
          <input
            required
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#f5a623]/50 transition-all"
            placeholder="Иван Иванов"
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Имейл адрес *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#f5a623]/50 transition-all"
            placeholder="ivan@example.com"
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Телефон *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#f5a623]/50 transition-all"
            placeholder="+359 888 123 456"
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Бележки (по желание)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#f5a623]/50 transition-all resize-none"
            placeholder="Допълнителна информация"
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs mb-1.5">Откъде научихте за нас?</label>
          <select
            value={attribution}
            onChange={(e) => setAttribution(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all"
          >
            <option value="">Изберете</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="google">Google</option>
            <option value="friend">Препоръка от приятел</option>
            <option value="other">Друго</option>
          </select>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-amber-500"
          />
          <span className="text-white/60 text-xs leading-relaxed">
            Съгласявам се с{" "}
            <a href="/terms" target="_blank" className="text-[#f5a623] hover:underline">
              условията за ползване
            </a>{" "}
            и{" "}
            <a href="/privacy" target="_blank" className="text-[#f5a623] hover:underline">
              политиката за поверителност
            </a>{" "}
            *
          </span>
        </label>
      </div>

      {/* Price summary reminder */}
      {totalAmount && (
        <div className="bg-[#1e3a52]/30 rounded-xl border border-white/10 p-4 flex items-center justify-between">
          <span className="text-white/60 text-sm">Обща сума</span>
          <span className="text-[#f5a623] font-bold text-lg">{formatPrice(totalAmount)}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white/70 font-medium rounded-xl text-sm transition-all"
        >
          ← Назад
        </button>
        <button
          type="submit"
          disabled={!isValid || loading}
          className="flex-1 bg-[#f5a623] hover:bg-[#f7b84a] disabled:opacity-50 text-[#0d1b2a] font-bold py-3 rounded-xl transition-all text-sm"
        >
          {loading
            ? "Зареждане..."
            : isFlowB
            ? "Продължи към плащане →"
            : "Изпрати заявка →"}
        </button>
      </div>
    </form>
  );
}
