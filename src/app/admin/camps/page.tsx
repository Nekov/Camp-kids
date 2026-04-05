export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import { fillPercent, formatDateRange, getProgressColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import QuickEditSpots from "@/components/admin/QuickEditSpots";

export default async function AdminCampsPage() {
  const sessions = await prisma.session.findMany({
    include: { pricingTiers: true, _count: { select: { registrations: true } } },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="max-w-7xl pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Лагери</h1>
          <p className="text-white/50 text-sm mt-0.5">{sessions.length} сесии</p>
        </div>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => {
          const pct = fillPercent(session.capacity, session.spotsTaken);
          const color = getProgressColor(pct);
          const isConfirmed = session.spotsTaken >= session.confirmedThreshold;
          const now = new Date();
          const activeTier =
            session.pricingTiers.find(
              (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > now
            ) ?? session.pricingTiers.find((t) => t.tierType === "STANDARD");

          return (
            <div key={session.id} className="bg-[#1e3a52]/30 border border-white/10 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-white font-semibold text-sm truncate">{session.name}</h3>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full",
                      session.status === "ACTIVE" && "bg-emerald-500/15 text-emerald-400",
                      session.status === "DRAFT" && "bg-white/10 text-white/40",
                      session.status === "SOLD_OUT" && "bg-red-500/15 text-red-400",
                      session.status === "ARCHIVED" && "bg-white/5 text-white/20",
                    )}>
                      {session.status}
                    </span>
                    {isConfirmed && <span className="text-xs text-emerald-400">✅ Потвърдена</span>}
                  </div>
                  <p className="text-white/40 text-xs">{formatDateRange(session.startDate, session.endDate)} • {session.minAge}–{session.maxAge} г.</p>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <p className="text-white/40 mb-0.5">Места</p>
                    <QuickEditSpots sessionId={session.id} spotsTaken={session.spotsTaken} capacity={session.capacity} />
                  </div>
                  <div className="text-center min-w-20">
                    <p className="text-white/40 mb-1">Запълване</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", color === "green" && "bg-emerald-500", color === "yellow" && "bg-amber-500", color === "red" && "bg-red-500")} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={cn("font-semibold", color === "green" && "text-emerald-400", color === "yellow" && "text-amber-400", color === "red" && "text-red-400")}>{pct}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white/40 mb-0.5">Активна цена</p>
                    <p className="text-[#f5a623] font-semibold">{activeTier ? `€${activeTier.price}` : "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/camps/${session.id}`} className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white/70 text-xs rounded-lg transition-all">
                    Редактирай
                  </Link>
                  <Link href={`/admin/clients?session=${session.id}`} className="px-3 py-1.5 bg-[#f5a623]/10 hover:bg-[#f5a623]/20 text-[#f5a623] text-xs rounded-lg transition-all">
                    Клиенти ({session._count.registrations})
                  </Link>
                  <Link href={`/programs/${session.slug}`} target="_blank" className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/40 text-xs rounded-lg transition-all">
                    Виж →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
