import Link from "next/link";
import type { Session, PricingTier } from "@prisma/client";
import { formatPrice, spotsRemaining, fillPercent, cn } from "@/lib/utils";

type SessionWithPricing = Session & { pricingTiers: PricingTier[] };

function getActiveTier(tiers: PricingTier[]): PricingTier | null {
  const now = new Date();
  const eb = tiers.find(
    (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > now
  );
  return eb ?? tiers.find((t) => t.tierType === "STANDARD") ?? null;
}

function getProgressColor(pct: number) {
  if (pct < 50) return "bg-sage";
  if (pct < 80) return "bg-amber";
  return "bg-ember";
}

function getProgressText(pct: number) {
  if (pct < 50) return "text-moss";
  if (pct < 80) return "text-amber";
  return "text-ember";
}

export default function SessionBookingBlock({ session }: { session: SessionWithPricing }) {
  const remaining = spotsRemaining(session.capacity, session.spotsTaken);
  const pct = fillPercent(session.capacity, session.spotsTaken);
  const isSoldOut = session.status === "SOLD_OUT" || remaining === 0;
  const activeTier = getActiveTier(session.pricingTiers);
  const earlyBird = session.pricingTiers.find((t) => t.tierType === "EARLY_BIRD");
  const standard = session.pricingTiers.find((t) => t.tierType === "STANDARD");
  const lastMinute = session.pricingTiers.find((t) => t.tierType === "LAST_MINUTE");

  return (
    <div className="rounded-2xl bg-cream border border-forest/15 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-5 border-b border-forest/10">
        <div className="text-xs text-moss mb-1">Цена от</div>
        <div className="text-3xl font-light text-teal" style={{ fontFamily: "var(--font-serif)" }}>
          {formatPrice(activeTier?.price ?? standard?.price ?? 0)}
        </div>
        <div className="text-moss text-xs mt-0.5">на дете, всичко включено</div>
      </div>

      {/* Pricing tiers */}
      <div className="p-5 space-y-2 border-b border-forest/10">
        {earlyBird && (
          <div className={cn("flex items-center justify-between px-3 py-2 rounded-lg border text-sm", activeTier?.tierType === "EARLY_BIRD" ? "bg-mint border-teal/30" : "opacity-40 border-forest/10")}>
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <span className="text-forest font-medium text-xs">{earlyBird.label}</span>
              {earlyBird.badgeText && activeTier?.tierType === "EARLY_BIRD" && (
                <span className="bg-teal text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {earlyBird.badgeText}
                </span>
              )}
            </div>
            <span className="font-bold text-teal text-sm">{formatPrice(earlyBird.price)}</span>
          </div>
        )}
        {standard && (
          <div className={cn("flex items-center justify-between px-3 py-2 rounded-lg border text-sm", activeTier?.tierType === "STANDARD" ? "bg-sand border-forest/20" : "opacity-40 border-forest/10")}>
            <span className={cn("text-forest text-xs", activeTier?.tierType === "EARLY_BIRD" && "line-through text-moss/40")}>{standard.label}</span>
            <span className="font-bold text-forest text-sm">{formatPrice(standard.price)}</span>
          </div>
        )}
        {lastMinute && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-forest/10 text-sm opacity-40">
            <div className="flex items-center gap-1.5 text-moss text-xs">
              <span>🔥</span> {lastMinute.label} <span>🔒</span>
            </div>
            <span className="font-bold text-moss text-xs">{formatPrice(lastMinute.price)}+</span>
          </div>
        )}
        <div className="text-xs text-moss/50 pt-1">
          💸 Отстъпка 5% за 2-ро и 10% за 3-то дете
        </div>
      </div>

      {/* Availability */}
      <div className="p-5 border-b border-forest/10">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className={cn("font-semibold", getProgressText(pct))}>
            {isSoldOut ? "Изчерпано" : `${remaining} свободни места`}
          </span>
          <span className="text-moss/50">{session.spotsTaken}/{session.capacity}</span>
        </div>
        <div className="h-1.5 bg-forest/10 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", getProgressColor(pct))} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Booking steps */}
      <div className="p-5 border-b border-forest/10">
        <p className="text-moss/60 text-xs font-medium mb-3">Как да запишете:</p>
        <div className="space-y-2">
          {["Попълни формата (2 мин.)", "Плати депозит €200", "Получи договора по имейл", "Окончателно плащане до 4 седмици"].map((step, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-moss">
              <span className="w-5 h-5 rounded-full bg-teal/15 text-teal font-bold flex items-center justify-center shrink-0 text-xs">
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
          <button className="w-full bg-moss/20 text-moss font-semibold py-4 rounded-xl text-sm cursor-default">
            Запишете се в чакалния списък
          </button>
        ) : (
          <Link
            href={`/register/${session.slug}`}
            className="block w-full bg-teal hover:bg-teal-dark text-white font-semibold py-4 rounded-xl text-center text-sm transition-all shadow-sm"
          >
            Запази място →
          </Link>
        )}
        <p className="text-center text-moss/50 text-xs">
          След заявката ще се свържем с вас.
        </p>
        <a href="tel:+359885571638" className="block text-center text-moss hover:text-teal text-xs transition-colors">
          📞 0885 571 638
        </a>
      </div>
    </div>
  );
}
