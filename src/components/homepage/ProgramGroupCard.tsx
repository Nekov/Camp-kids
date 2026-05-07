"use client";

import Link from "next/link";
import type { Session, PricingTier } from "@prisma/client";
import type { ProgramGroup } from "@/lib/programGroups";
import {
  cn,
  formatDateRange,
  campDuration,
  fillPercent,
  spotsRemaining,
  formatPrice,
} from "@/lib/utils";

type SessionWithPricing = Session & { pricingTiers: PricingTier[] };

interface ProgramGroupCardProps {
  group: ProgramGroup;
  sessions: SessionWithPricing[];
}

function getEarlyBirdPrice(tiers: PricingTier[]): number | null {
  const now = new Date();
  const eb = tiers.find(
    (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > now
  );
  return eb ? eb.price : null;
}

function getLowestGroupPrice(sessions: SessionWithPricing[]): number | null {
  let lowest: number | null = null;
  for (const s of sessions) {
    if (s.status === "ARCHIVED") continue;
    const eb = getEarlyBirdPrice(s.pricingTiers);
    const std = s.pricingTiers.find((t) => t.tierType === "STANDARD")?.price ?? null;
    const price = eb ?? std;
    if (price !== null && (lowest === null || price < lowest)) lowest = price;
  }
  return lowest;
}

function getNextActiveSession(sessions: SessionWithPricing[]): SessionWithPricing | null {
  const now = new Date();
  // Find the soonest future session that is ACTIVE or DRAFT (not archived/sold out)
  return (
    sessions
      .filter((s) => s.status !== "ARCHIVED" && new Date(s.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0] ?? null
  );
}

function getProgressColors(pct: number) {
  if (pct < 50) return { bar: "bg-sage", text: "text-moss" };
  if (pct < 80) return { bar: "bg-amber", text: "text-amber" };
  return { bar: "bg-ember", text: "text-ember" };
}

export default function ProgramGroupCard({ group, sessions }: ProgramGroupCardProps) {
  const lowestPrice = getLowestGroupPrice(sessions);
  const nextSession = getNextActiveSession(sessions);
  const activeSessions = sessions.filter((s) => s.status !== "ARCHIVED");
  const hasEarlyBird = sessions.some((s) => getEarlyBirdPrice(s.pricingTiers) !== null);

  // Use next active session for the spots bar, or fall back to any session
  const spotSession = nextSession ?? activeSessions[0] ?? null;
  const pct = spotSession ? fillPercent(spotSession.capacity, spotSession.spotsTaken) : 0;
  const remaining = spotSession ? spotsRemaining(spotSession.capacity, spotSession.spotsTaken) : 0;
  const colors = getProgressColors(pct);
  const isSoldOut = spotSession
    ? spotSession.status === "SOLD_OUT" || remaining === 0
    : false;

  const sessionCount = activeSessions.length;
  const confirmedCount = activeSessions.filter((s) => s.spotsTaken >= s.confirmedThreshold).length;

  return (
    <Link
      href={`/programs/${group.slug}`}
      className="group relative flex flex-col rounded-2xl bg-cream border border-forest/10 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Hero image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-forest/20 to-teal/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={group.heroImage}
          alt={group.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cream to-transparent" />

        {/* Badges */}
        {hasEarlyBird && (
          <div className="absolute top-3 left-3 bg-teal text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            🏆 Ранна цена
          </div>
        )}
        {confirmedCount > 0 && (
          <div className="absolute top-3 right-3 bg-mint text-fern text-xs font-semibold px-3 py-1 rounded-full border border-teal/20">
            ✓ Потвърдена
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title & age */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-forest font-semibold text-base leading-tight">{group.name}</h3>
          <span className="shrink-0 bg-mint text-fern text-xs px-2.5 py-1 rounded-full border border-teal/15 whitespace-nowrap">
            {group.ageRange}
          </span>
        </div>

        <p className="text-moss/70 text-sm leading-snug">{group.tagline}</p>

        {/* Session count + next date */}
        {nextSession && (
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 bg-forest/8 border border-forest/15 text-forest text-xs font-semibold px-2.5 py-1 rounded-full">
              📅 {formatDateRange(nextSession.startDate, nextSession.endDate)}
            </span>
            <span className="inline-flex items-center gap-1 bg-teal/10 border border-teal/20 text-teal text-xs font-semibold px-2.5 py-1 rounded-full">
              🕐 {campDuration(nextSession.startDate, nextSession.endDate)}
            </span>
            {sessionCount > 1 && (
              <span className="inline-flex items-center gap-1 bg-sand border border-forest/12 text-moss text-xs px-2.5 py-1 rounded-full">
                +{sessionCount - 1} {sessionCount - 1 === 1 ? "дата" : "дати"}
              </span>
            )}
          </div>
        )}

        {/* Spots bar for next session */}
        {spotSession && !isSoldOut && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className={cn("font-semibold", colors.text)}>
                {remaining} свободни места
              </span>
              <span className="text-moss/40 text-xs">
                {nextSession?.status === "DRAFT" ? "Скоро" : `${spotSession.capacity} общо`}
              </span>
            </div>
            <div className="h-2 bg-forest/10 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", colors.bar)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {isSoldOut && (
          <div className="flex items-center gap-2 text-ember text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-ember" />
            Изчерпано
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {lowestPrice !== null ? (
            <div>
              <span className="text-moss text-xs">от</span>{" "}
              <span className="text-teal font-bold text-base">{formatPrice(lowestPrice)}</span>
            </div>
          ) : (
            <div />
          )}
          <span className="inline-flex items-center gap-1.5 bg-teal group-hover:bg-teal-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all shadow-sm">
            Виж →
          </span>
        </div>
      </div>
    </Link>
  );
}
