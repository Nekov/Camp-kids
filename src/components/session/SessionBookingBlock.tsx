import Link from "next/link";
import type { Session, PricingTier } from "@prisma/client";
import {
  formatPrice,
  spotsRemaining,
  fillPercent,
  getProgressColor,
  cn,
} from "@/lib/utils";

type SessionWithPricing = Session & { pricingTiers: PricingTier[] };

function getActiveTier(tiers: PricingTier[]): PricingTier | null {
  const now = new Date();
  const eb = tiers.find(
    (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > now
  );
  return eb ?? tiers.find((t) => t.tierType === "STANDARD") ?? null;
}

export default function SessionBookingBlock({ session }: { session: SessionWithPricing }) {
  const remaining = spotsRemaining(session.capacity, session.spotsTaken);
  const pct = fillPercent(session.capacity, session.spotsTaken);
  const color = getProgressColor(pct);
  const isSoldOut = session.status === "SOLD_OUT" || remaining === 0;
  const activeTier = getActiveTier(session.pricingTiers);
  const earlyBird = session.pricingTiers.find((t) => t.tierType === "EARLY_BIRD");
  const standard = session.pricingTiers.find((t) => t.tierType === "STANDARD");
  const lastMinute = session.pricingTiers.find((t) => t.tierType === "LAST_MINUTE");

  return (
    <div className="rounded-2xl bg-[#1e3a52] border border-white/15 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <div className="text-xs text-white/50 mb-1">Цена от</div>
        <div className="text-3xl font-bold text-[#f5a623]">
          {formatPrice(activeTier?.price ?? standard?.price ?? 0)}
        </div>
        <div className="text-white/50 text-xs mt-0.5">на дете, всичко включено</div>
      </div>

      {/* Pricing tiers */}
      <div className="p-5 space-y-2 border-b border-white/10">
        {earlyBird && (
          <div className={cn("flex items-center justify-between px-3 py-2 rounded-lg border text-sm", activeTier?.tierType === "EARLY_BIRD" ? "bg-[#f5a623]/15 border-[#f5a623]/40" : "opacity-40 border-white/10")}>
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <span className="text-white font-medium text-xs">{earlyBird.label}</span>
              {earlyBird.badgeText && activeTier?.tierType === "EARLY_BIRD" && (
                <span className="bg-[#f5a623] text-[#0d1b2a] text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {earlyBird.badgeText}
                </span>
              )}
            </div>
            <span className="font-bold text-[#f5a623] text-sm">{formatPrice(earlyBird.price)}</span>
          </div>
        )}
        {standard && (
          <div className={cn("flex items-center justify-between px-3 py-2 rounded-lg border text-sm", activeTier?.tierType === "STANDARD" ? "bg-white/5 border-white/20" : "opacity-40 border-white/10")}>
            <span className={cn("text-white text-xs", activeTier?.tierType === "EARLY_BIRD" && "line-through text-white/40")}>{standard.label}</span>
            <span className="font-bold text-white text-sm">{formatPrice(standard.price)}</span>
          </div>
        )}
        {lastMinute && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 text-sm opacity-40">
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <span>🔥</span> {lastMinute.label} <span>🔒</span>
            </div>
            <span className="font-bold text-white/60 text-xs">{formatPrice(lastMinute.price)}+</span>
          </div>
        )}

        <div className="text-xs text-white/40 pt-1">
          💸 Отстъпка 6% за второ дете от едно семейство
        </div>
      </div>

      {/* Availability */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className={cn("font-semibold", color === "green" && "text-emerald-400", color === "yellow" && "text-amber-400", color === "red" && "text-red-400")}>
            {isSoldOut ? "Изчерпано" : `${remaining} свободни места`}
          </span>
          <span className="text-white/40">{session.spotsTaken}/{session.capacity}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", color === "green" && "bg-emerald-500", color === "yellow" && "bg-amber-500", color === "red" && "bg-red-500")} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Booking steps */}
      <div className="p-5 border-b border-white/10">
        <p className="text-white/50 text-xs font-medium mb-3">Как да запишете:</p>
        <div className="space-y-2">
          {[
            "Попълни формата (2 мин.)",
            "Плати депозит €200",
            "Получи договора по имейл",
            "Окончателно плащане до 4 седмици",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-white/60">
              <span className="w-5 h-5 rounded-full bg-[#f5a623]/20 text-[#f5a623] font-bold flex items-center justify-center shrink-0 text-xs">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-5 space-y-3">
        {isSoldOut ? (
          <button className="w-full bg-[#6b7280] text-white font-semibold py-4 rounded-xl text-sm cursor-default">
            Запишете се в чакалния списък
          </button>
        ) : (
          <Link
            href={`/register/${session.slug}`}
            className="block w-full bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold py-4 rounded-xl text-center text-sm transition-all shadow-lg hover:shadow-amber-500/20"
          >
            Запази място →
          </Link>
        )}
        <p className="text-center text-white/40 text-xs">
          След заявката ще се свържем с вас.
        </p>
        <a href="tel:+359885571638" className="block text-center text-white/50 hover:text-white text-xs transition-colors">
          📞 0885 571 638
        </a>
      </div>
    </div>
  );
}
