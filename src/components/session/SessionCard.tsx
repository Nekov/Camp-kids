"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import type { Session, PricingTier } from "@prisma/client";
import {
  cn,
  formatDateRange,
  fillPercent,
  spotsRemaining,
  getProgressLabel,
  countdownToDate,
  timeAgoText,
  formatPrice,
} from "@/lib/utils";

type SessionWithPricing = Session & { pricingTiers: PricingTier[] };

interface SessionCardProps {
  session: SessionWithPricing;
}

function getActiveTier(tiers: PricingTier[]): PricingTier | null {
  const now = new Date();
  const eb = tiers.find(
    (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > now
  );
  if (eb) return eb;
  return tiers.find((t) => t.tierType === "STANDARD") ?? null;
}

function getProgressColors(pct: number) {
  if (pct < 50) return { bar: "bg-sage", dot: "bg-sage", text: "text-moss", label: "Свободни места" };
  if (pct < 80) return { bar: "bg-amber", dot: "bg-amber", text: "text-amber", label: "Запълва се" };
  return { bar: "bg-ember", dot: "bg-ember", text: "text-ember", label: "Почти пълно" };
}

export default function SessionCard({ session }: SessionCardProps) {
  const pct = fillPercent(session.capacity, session.spotsTaken);
  const remaining = spotsRemaining(session.capacity, session.spotsTaken);
  const colors = getProgressColors(pct);
  const label = getProgressLabel(pct);
  const isSoldOut = session.status === "SOLD_OUT" || remaining === 0;
  const isConfirmed = session.spotsTaken >= session.confirmedThreshold;

  const activeTier = getActiveTier(session.pricingTiers);
  const earlyBird = session.pricingTiers.find((t) => t.tierType === "EARLY_BIRD");
  const standard = session.pricingTiers.find((t) => t.tierType === "STANDARD");
  const lastMinute = session.pricingTiers.find((t) => t.tierType === "LAST_MINUTE");

  const [countdown, setCountdown] = useState(
    earlyBird?.activeUntil ? countdownToDate(earlyBird.activeUntil) : null
  );

  useEffect(() => {
    if (!earlyBird?.activeUntil) return;
    const interval = setInterval(() => {
      setCountdown(countdownToDate(earlyBird.activeUntil!));
    }, 1000);
    return () => clearInterval(interval);
  }, [earlyBird?.activeUntil]);

  const lastBookingText = timeAgoText(session.lastBookingAt ? new Date(session.lastBookingAt) : null);

  return (
    <div className="relative flex flex-col rounded-2xl bg-cream border border-forest/10 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      {/* Badges */}
      {pct >= 70 && !isSoldOut && (
        <div className="absolute top-3 left-3 z-10 bg-amber text-white text-xs font-bold px-3 py-1 rounded-full">
          🔥 Най-популярен
        </div>
      )}
      {isConfirmed && (
        <div className="absolute top-3 right-3 z-10 bg-mint text-fern text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-teal/20">
          ✓ Потвърдена
        </div>
      )}

      {/* Image placeholder */}
      <div className="h-36 bg-gradient-to-br from-forest/20 to-teal/10 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">
          🎨
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-cream to-transparent" />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-forest font-semibold text-base leading-tight">{session.name}</h3>
            <span className="shrink-0 bg-mint text-fern text-xs px-2 py-1 rounded-full whitespace-nowrap border border-teal/15">
              {session.minAge}–{session.maxAge} г.
            </span>
          </div>
          <p className="text-moss text-xs">{formatDateRange(session.startDate, session.endDate)}</p>
          <p className="text-moss/60 text-xs">📍 Глемпинг Столът, Севлиево</p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={cn("font-semibold", colors.text)}>
              {isSoldOut ? "Изчерпано" : `${remaining} свободни места`}
            </span>
            <span className="text-moss/50">{label}</span>
          </div>
          <div className="relative h-2 bg-forest/10 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-1000", colors.bar)}
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Spot dots */}
          <div className="flex gap-0.5 mt-2 flex-wrap">
            {Array.from({ length: session.capacity }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  i < session.spotsTaken ? colors.dot : "bg-forest/10"
                )}
              />
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-1.5">
          {earlyBird && (
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg border text-sm",
                activeTier?.tierType === "EARLY_BIRD"
                  ? "bg-mint border-teal/30 text-forest"
                  : "opacity-40 border-forest/10"
              )}
            >
              <div className="flex items-center gap-2">
                <span>🏆</span>
                <span className="font-medium">{earlyBird.label}</span>
                {earlyBird.badgeText && activeTier?.tierType === "EARLY_BIRD" && (
                  <span className="bg-teal text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {earlyBird.badgeText}
                  </span>
                )}
              </div>
              <span className="font-bold text-teal">{formatPrice(earlyBird.price)}</span>
            </div>
          )}
          {standard && (
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg border text-sm",
                activeTier?.tierType === "STANDARD"
                  ? "bg-sand border-forest/20 text-forest"
                  : "opacity-40 border-forest/10"
              )}
            >
              <div className="flex items-center gap-2">
                <span>•</span>
                <span className={cn("font-medium", activeTier?.tierType === "EARLY_BIRD" && "line-through text-moss/40")}>
                  {standard.label}
                </span>
              </div>
              <span className="font-bold text-forest">{formatPrice(standard.price)}</span>
            </div>
          )}
          {lastMinute && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-forest/10 text-sm opacity-40">
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span>{lastMinute.label}</span>
              </div>
              <span className="font-bold text-forest">{formatPrice(lastMinute.price)}+</span>
            </div>
          )}
        </div>

        {/* Countdown */}
        {countdown && !countdown.expired && activeTier?.tierType === "EARLY_BIRD" && (
          <div className="text-center text-xs text-amber bg-amber/8 rounded-lg py-2 px-3 border border-amber/20">
            ⏱ Ранна цена изтича след{" "}
            <span className="font-mono font-bold">
              {countdown.days}д {countdown.hours}ч {countdown.minutes}м
            </span>
          </div>
        )}

        {/* FOMO signals */}
        <div className="space-y-1">
          {lastBookingText && (
            <p className="flex items-center gap-1.5 text-xs text-moss/50">
              <Clock className="w-3 h-3" />
              Последно записване: {lastBookingText}
            </p>
          )}
          {session.viewersNow > 1 && (
            <p className="flex items-center gap-1.5 text-xs text-amber">
              <Eye className="w-3 h-3" />
              {session.viewersNow} семейства разглеждат в момента
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-2 mt-auto pt-2">
          {isSoldOut ? (
            <button className="flex-1 bg-moss/20 text-moss font-semibold text-sm py-3 rounded-full cursor-default">
              Чакален списък
            </button>
          ) : (
            <Link
              href={`/register/${session.slug}`}
              className="flex-1 bg-teal hover:bg-teal-dark text-white font-semibold text-sm py-3 rounded-full text-center transition-all active:scale-95 shadow-sm hover:shadow-teal/20"
            >
              Запази място
            </Link>
          )}
          <Link
            href={`/programs/${session.slug}`}
            className="px-4 py-3 bg-forest/8 hover:bg-forest/15 text-forest font-semibold text-sm rounded-full transition-all whitespace-nowrap border border-forest/15"
          >
            Повече →
          </Link>
        </div>
      </div>
    </div>
  );
}
