export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import { fillPercent, formatPrice, getProgressColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import QuickEditSpots from "@/components/admin/QuickEditSpots";

export default async function AdminDashboardPage() {
  const [sessions, totalClients, recentRegistrations] = await Promise.all([
    prisma.session.findMany({
      where: { status: { not: "ARCHIVED" } },
      include: { pricingTiers: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.registration.count({ where: { status: { not: "UNFINISHED" } } }),
    prisma.registration.count({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const totalRevenue = await prisma.registration.aggregate({
    _sum: { totalAmount: true },
    where: { status: { in: ["DEPOSIT_PAID", "CONTRACT_SIGNED", "PAID_IN_FULL"] } },
  });

  const unfinished = await prisma.registration.count({ where: { status: "UNFINISHED" } });

  return (
    <div className="max-w-7xl pt-14 lg:pt-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Табло</h1>
        <p className="text-white/50 text-sm mt-0.5">Преглед на всички лагери и записвания</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Записани клиенти", value: totalClients, sub: "всички статуси" },
          { label: "Нови днес", value: recentRegistrations, sub: "последните 24ч" },
          { label: "Незавършени", value: unfinished, sub: "нуждаят се от follow-up" },
          { label: "Потвърдени приходи", value: formatPrice(totalRevenue._sum.totalAmount ?? 0), sub: "от платени депозити" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1e3a52]/50 border border-white/10 rounded-xl p-4">
            <p className="text-white/50 text-xs mb-1">{stat.label}</p>
            <p className="text-white font-bold text-xl">{stat.value}</p>
            <p className="text-white/30 text-xs mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Camps table */}
      <div className="bg-[#1e3a52]/30 border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-bold text-sm">Лагери — живо табло</h2>
          <Link href="/admin/camps" className="text-[#f5a623] text-xs hover:underline">
            Управление →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                {["Лагер", "Дати", "Деца", "Запълване", "Потвърдена", "Активна цена", "Приходи", "Действия"].map((h) => (
                  <th key={h} className="text-left text-white/40 font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                  <tr key={session.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/camps/${session.id}`} className="text-white hover:text-[#f5a623] font-medium transition-colors">
                        {session.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {new Date(session.startDate).toLocaleDateString("bg-BG", { day: "numeric", month: "short" })}–{new Date(session.endDate).toLocaleDateString("bg-BG", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <QuickEditSpots
                        sessionId={session.id}
                        spotsTaken={session.spotsTaken}
                        capacity={session.capacity}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", color === "green" && "bg-emerald-500", color === "yellow" && "bg-amber-500", color === "red" && "bg-red-500")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={cn(color === "green" && "text-emerald-400", color === "yellow" && "text-amber-400", color === "red" && "text-red-400")}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isConfirmed ? (
                        <span className="text-emerald-400">✅ Да</span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#f5a623]">
                      {activeTier ? `${activeTier.label} • ${formatPrice(activeTier.price)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-white/70">—</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/camps/${session.id}`} className="text-white/40 hover:text-white text-xs transition-colors">Редактирай</Link>
                        <Link href={`/programs/${session.slug}`} target="_blank" className="text-white/40 hover:text-[#f5a623] text-xs transition-colors">Виж →</Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {[
          { href: "/admin/clients", label: "Всички клиенти", icon: "👥" },
          { href: "/admin/clients?status=UNFINISHED", label: "Незавършени", icon: "⏳" },
          { href: "/admin/promo-codes", label: "Промо кодове", icon: "🏷️" },
          { href: "/admin/blog", label: "Блог", icon: "✍️" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="flex items-center gap-2.5 p-4 rounded-xl bg-[#1e3a52]/30 border border-white/10 hover:border-[#f5a623]/30 transition-all text-sm text-white/70 hover:text-white">
            <span>{link.icon}</span> {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
