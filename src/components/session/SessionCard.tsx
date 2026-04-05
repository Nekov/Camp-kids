"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Clock, Eye } from "lucide-react";
import type { Session, PricingTier } from "@prisma/client";
import {
  cn,
  formatDateRange,
  fillPercent,
  spotsRemaining,
  getProgressColor,
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
  // Early bird active?
  const eb = tiers.find(
    (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > now
  );
  if (eb) return eb;
  // Standard
  return tiers.find((t) => t.tierType === "STANDARD") ?? null;
}

export default function SessionCard({ session }: SessionCardProps) {
  const pct = fillPercent(session.capacity, session.spotsTaken);
  const remaining = spotsRemaining(session.capacity, session.spotsTaken);
  const color = getProgressColor(pct);
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
    <div className="relative flex flex-col rounded-2xl bg-[#1e3a52] border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Most popular badge */}
      {pct >= 70 && !isSoldOut && (
        <div className="absolute top-3 left-3 z-10 bg-[#f5a623] text-[#0d1b2a] text-xs font-bold px-3 py-1 rounded-full">
          🔥 Най-популярен
        </div>
      )}
      {isConfirmed && (
        <div className="absolute top-3 right-3 z-10 bg-[#2d6a2f] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          ✅ Потвърдена
        </div>
      )}

      {/* Image placeholder */}
      <div className="h-36 bg-gradient-to-br from-[#254d6e] to-[#12253a] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">
          🎨
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1e3a52] to-transparent" />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-white font-bold text-base leading-tight">{session.name}</h3>
            <span className="shrink-0 bg-[#254d6e] text-[#a8b8c8] text-xs px-2 py-1 rounded-full whitespace-nowrap">
              {session.minAge}–{session.maxAge} г.
            </span>
          </div>
          <p className="text-white/50 text-xs">{formatDateRange(session.startDate, session.endDate)}</p>
          <p className="text-white/40 text-xs">📍 Глемпинг Столът, Севлиево</p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span
              className={cn(
                "font-semibold",
                color === "green" && "text-emerald-400",
                color === "yellow" && "text-amber-400",
                color === "red" && "text-red-400"
              )}
            >
              {isSoldOut ? "Изчерпано" : `🔥 ${remaining} свободни места`}
            </span>
            <span className="text-white/40">{label}</span>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                color === "green" && "bg-emerald-500",
                color === "yellow" && "bg-amber-500",
                color === "red" && "bg-red-500"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Avatar dots */}
          <div className="flex gap-0.5 mt-2 flex-wrap">
            {Array.from({ length: session.capacity }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  i < session.spotsTaken
                    ? color === "green"
                      ? "bg-emerald-500"
                      : color === "yellow"
                      ? "bg-amber-500"
                      : "bg-red-500"
                    : "bg-white/15"
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
                  ? "bg-[#f5a623]/15 border-[#f5a623]/40 text-white"
                  : "opacity-50 border-white/10"
              )}
            >
              <div className="flex items-center gap-2">
                <span>🏆</span>
                <span className="font-medium">{earlyBird.label}</span>
                {earlyBird.badgeText && activeTier?.tierType === "EARLY_BIRD" && (
                  <span className="bg-[#f5a623] text-[#0d1b2a] text-xs font-bold px-2 py-0.5 rounded-full">
                    {earlyBird.badgeText}
                  </span>
                )}
              </div>
              <span className="font-bold text-[#f5a623]">{formatPrice(earlyBird.price)}</span>
            </div>
          )}
          {standard && (
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg border text-sm",
                activeTier?.tierType === "STANDARD"
                  ? "bg-white/5 border-white/20 text-white"
                  : "opacity-50 border-white/10"
              )}
            >
              <div className="flex items-center gap-2">
                <span>•</span>
                <span className={cn("font-medium", activeTier?.tierType === "EARLY_BIRD" && "line-through text-white/40")}>
                  {standard.label}
                </span>
              </div>
              <span className="font-bold">{formatPrice(standard.price)}</span>
            </div>
          )}
          {lastMinute && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 text-sm opacity-40">
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span>{lastMinute.label}</span>
                <span className="text-white/30 text-xs">🔒</span>
              </div>
              <span className="font-bold">{formatPrice(lastMinute.price)}+</span>
            </div>
          )}
        </div>

        {/* Countdown */}
        {countdown && !countdown.expired && activeTier?.tierType === "EARLY_BIRD" && (
          <div className="text-center text-xs text-[#f5a623]/80 bg-[#f5a623]/5 rounded-lg py-2 px-3">
            ⏱ Ранна цена изтича след{" "}
            <span className="font-mono font-bold text-[#f5a623]">
              {countdown.days}д {countdown.hours}ч {countdown.minutes}м
            </span>
          </div>
        )}

        {/* FOMO signals */}
        <div className="space-y-1">
          {lastBookingText && (
            <p className="flex items-center gap-1.5 text-xs text-white/40">
              <Clock className="w-3 h-3" />
              Последно записване: {lastBookingText}
            </p>
          )}
          {session.viewersNow > 1 && (
            <p className="flex items-center gap-1.5 text-xs text-amber-400/70">
              <Eye className="w-3 h-3" />
              {session.viewersNow} семейства разглеждат в момента
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-2 mt-auto pt-2">
          {isSoldOut ? (
            <button className="flex-1 bg-[#6b7280] text-white font-semibold text-sm py-3 rounded-full cursor-default">
              Запиши се в чакалния списък
            </button>
          ) : (
            <Link
              href={`/register/${session.slug}`}
              className="flex-1 bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold text-sm py-3 rounded-full text-center transition-all active:scale-95 shadow-lg hover:shadow-amber-500/20"
            >
              Запази място
            </Link>
          )}
          <Link
            href={`/programs/${session.slug}`}
            className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white/80 font-semibold text-sm rounded-full transition-all whitespace-nowrap"
          >
            Повече →
          </Link>
        </div>
      </div>
    </div>
  );
}
