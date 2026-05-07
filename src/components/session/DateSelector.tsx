"use client";

import { useState } from "react";
import Link from "next/link";
import type { Session, PricingTier } from "@prisma/client";
import {
  cn,
  formatDateRange,
  campDuration,
  fillPercent,
  spotsRemaining,
  formatPrice,
} from "@/lib/utils";
import { sessionShortLabel } from "@/lib/programGroups";

type SessionWithPricing = Session & { pricingTiers: PricingTier[] };

interface DateSelectorProps {
  sessions: SessionWithPricing[];
}

function getEarlyBirdPrice(tiers: PricingTier[]): number | null {
  const now = new Date();
  const eb = tiers.find(
    (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > now
  );
  return eb ? eb.price : null;
}

function getStandardPrice(tiers: PricingTier[]): number | null {
  const s = tiers.find((t) => t.tierType === "STANDARD");
  return s ? s.price : null;
}

function getLowestPrice(tiers: PricingTier[]): number | null {
  const eb = getEarlyBirdPrice(tiers);
  if (eb !== null) return eb;
  return getStandardPrice(tiers);
}

function getProgressColors(pct: number) {
  if (pct < 50) return { bar: "bg-sage", text: "text-moss" };
  if (pct < 80) return { bar: "bg-amber", text: "text-amber" };
  return { bar: "bg-ember", text: "text-ember" };
}

export default function DateSelector({ sessions }: DateSelectorProps) {
  // Default to first non-sold-out, non-draft session
  const defaultSession =
    sessions.find((s) => s.status !== "ARCHIVED" && s.status !== "SOLD_OUT" && s.status !== "DRAFT") ??
    sessions[0];

  const [selectedSlug, setSelectedSlug] = useState<string>(defaultSession?.slug ?? "");

  const selected = sessions.find((s) => s.slug === selectedSlug) ?? null;

  const isDraft = (s: Session) => s.status === "DRAFT";
  const isSoldOut = (s: Session) =>
    s.status === "SOLD_OUT" || spotsRemaining(s.capacity, s.spotsTaken) === 0;

  return (
    <div className="rounded-2xl bg-cream border border-forest/12 overflow-hidden shadow-md">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-forest/8">
        <h3 className="text-forest font-semibold text-sm uppercase tracking-widest text-xs mb-1">
          Изберете дата
        </h3>
        <p className="text-moss text-xs">Всяка сесия е независима. Изберете подходящата за вас.</p>
      </div>

      {/* Date cards */}
      <div className="p-4 space-y-2.5">
        {sessions.map((s) => {
          const draft = isDraft(s);
          const soldOut = isSoldOut(s);
          const pct = fillPercent(s.capacity, s.spotsTaken);
          const remaining = spotsRemaining(s.capacity, s.spotsTaken);
          const colors = getProgressColors(pct);
          const isSelected = s.slug === selectedSlug;
          const lowestPrice = getLowestPrice(s.pricingTiers);
          const ebPrice = getEarlyBirdPrice(s.pricingTiers);
          const stdPrice = getStandardPrice(s.pricingTiers);
          const disabled = draft || soldOut;

          return (
            <button
              key={s.slug}
              onClick={() => !disabled && setSelectedSlug(s.slug)}
              disabled={disabled}
              className={cn(
                "w-full text-left rounded-xl border p-3.5 transition-all duration-200",
                isSelected && !disabled
                  ? "border-teal bg-teal/5 shadow-sm ring-1 ring-teal/20"
                  : disabled
                  ? "border-forest/8 bg-forest/3 opacity-60 cursor-default"
                  : "border-forest/12 bg-white hover:border-teal/40 hover:bg-teal/3 cursor-pointer"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Selection indicator */}
                  <div
                    className={cn(
                      "shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected && !disabled
                        ? "border-teal bg-teal"
                        : "border-forest/25 bg-white"
                    )}
                  >
                    {isSelected && !disabled && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-forest font-semibold text-sm leading-tight">
                      {sessionShortLabel(s.name)}
                    </p>
                    <p className="text-moss text-xs mt-0.5">
                      {formatDateRange(s.startDate, s.endDate)} · {campDuration(s.startDate, s.endDate)}
                    </p>
                  </div>
                </div>

                {/* Badge / price */}
                <div className="shrink-0 text-right">
                  {draft ? (
                    <span className="inline-flex items-center gap-1 bg-sand border border-forest/15 text-moss text-xs font-medium px-2 py-0.5 rounded-full">
                      ⏳ Очаквайте
                    </span>
                  ) : soldOut ? (
                    <span className="inline-flex items-center gap-1 bg-ember/10 border border-ember/20 text-ember text-xs font-semibold px-2 py-0.5 rounded-full">
                      Изчерпано
                    </span>
                  ) : lowestPrice !== null ? (
                    <div className="flex flex-col items-end gap-0.5">
                      {ebPrice !== null && (
                        <span className="text-teal font-bold text-sm">{formatPrice(ebPrice)}</span>
                      )}
                      {stdPrice !== null && ebPrice !== null && (
                        <span className="text-moss/40 text-xs line-through">{formatPrice(stdPrice)}</span>
                      )}
                      {stdPrice !== null && ebPrice === null && (
                        <span className="text-forest font-bold text-sm">{formatPrice(stdPrice)}</span>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Spots bar */}
              {!draft && !soldOut && (
                <div className="mt-1.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={cn("font-medium", colors.text)}>
                      {remaining} свободни места
                    </span>
                    <span className="text-moss/40">{s.capacity} общо</span>
                  </div>
                  <div className="h-1.5 bg-forest/8 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", colors.bar)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-4 pb-5">
        {selected && !isDraft(selected) && !isSoldOut(selected) ? (
          <Link
            href={`/register/${selected.slug}`}
            className="block w-full text-center bg-teal hover:bg-teal-dark text-white font-semibold py-3.5 rounded-xl text-base transition-all shadow-sm hover:shadow-teal/20 hover:-translate-y-0.5"
          >
            Запази място →
          </Link>
        ) : selected && isDraft(selected) ? (
          <button
            disabled
            className="block w-full text-center bg-forest/10 text-moss font-semibold py-3.5 rounded-xl text-base cursor-default"
          >
            Очаквайте скоро
          </button>
        ) : selected && isSoldOut(selected) ? (
          <button
            disabled
            className="block w-full text-center bg-forest/10 text-moss font-semibold py-3.5 rounded-xl text-base cursor-default"
          >
            Чакален списък
          </button>
        ) : null}

        <p className="text-center text-moss/40 text-xs mt-3">
          Без скрити такси · Пълно строниране
        </p>
      </div>
    </div>
  );
}
