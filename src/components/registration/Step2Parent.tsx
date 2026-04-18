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
      <div className="bg-cream rounded-2xl border border-forest/10 p-6 space-y-4">
        <h2 className="text-forest font-bold text-base mb-1">Данни за родителя / настойника</h2>

        <div>
          <label className="block text-moss text-xs mb-1.5">Пълно име *</label>
          <input
            required
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full bg-linen border border-forest/15 rounded-xl px-3 py-2.5 text-forest text-sm placeholder-moss/40 focus:outline-none focus:border-teal/50 transition-all"
            placeholder="Иван Иванов"
          />
        </div>

        <div>
          <label className="block text-moss text-xs mb-1.5">Имейл адрес *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-linen border border-forest/15 rounded-xl px-3 py-2.5 text-forest text-sm placeholder-moss/40 focus:outline-none focus:border-teal/50 transition-all"
            placeholder="ivan@example.com"
          />
        </div>

        <div>
          <label className="block text-moss text-xs mb-1.5">Телефон *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-linen border border-forest/15 rounded-xl px-3 py-2.5 text-forest text-sm placeholder-moss/40 focus:outline-none focus:border-teal/50 transition-all"
            placeholder="+359 888 123 456"
          />
        </div>

        <div>
          <label className="block text-moss text-xs mb-1.5">Бележки (по желание)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-linen border border-forest/15 rounded-xl px-3 py-2.5 text-forest text-sm placeholder-moss/40 focus:outline-none focus:border-teal/50 transition-all resize-none"
            placeholder="Допълнителна информация"
          />
        </div>

        <div>
          <label className="block text-moss text-xs mb-1.5">Откъде научихте за нас?</label>
          <select
            value={attribution}
            onChange={(e) => setAttribution(e.target.value)}
            className="w-full bg-linen border border-forest/15 rounded-xl px-3 py-2.5 text-forest text-sm focus:outline-none focus:border-teal/50 transition-all"
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
          <span className="text-moss text-xs leading-relaxed">
            Съгласявам се с{" "}
            <a href="/terms" target="_blank" className="text-teal hover:underline">
              условията за ползване
            </a>{" "}
            и{" "}
            <a href="/privacy" target="_blank" className="text-teal hover:underline">
              политиката за поверителност
            </a>{" "}
            *
          </span>
        </label>
      </div>

      {/* Price summary reminder */}
      {totalAmount && (
        <div className="bg-mint rounded-xl border border-teal/20 p-4 flex items-center justify-between">
          <span className="text-moss text-sm">Обща сума</span>
          <span className="text-teal font-bold text-lg">{formatPrice(totalAmount)}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 bg-forest/8 hover:bg-forest/15 text-moss font-medium rounded-xl text-sm transition-all"
        >
          ← Назад
        </button>
        <button
          type="submit"
          disabled={!isValid || loading}
          className="flex-1 bg-teal hover:bg-teal-dark disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all text-sm"
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
