import Link from "next/link";
import { prisma } from "@/lib/db";
import SessionCard from "@/components/session/SessionCard";

export default async function SessionGrid() {
  const sessions = await prisma.session.findMany({
    where: { homepageVisible: true, status: { not: "ARCHIVED" } },
    include: { pricingTiers: true },
    orderBy: [{ spotsTaken: "desc" }, { displayOrder: "asc" }],
  });

  return (
    <section id="sessions" className="py-20 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Програми 2026
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-light text-forest" style={{ fontFamily: "var(--font-serif)" }}>
            Избери своята сесия
          </h2>
          <p className="mt-4 text-moss max-w-2xl mx-auto text-base leading-relaxed">
            Шест сесии с различни теми и възрастови групи. Всяко място е ограничено —
            максимум 30 деца на сесия.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/programs/session-1"
            className="inline-flex items-center gap-2 text-moss hover:text-forest text-sm border border-forest/20 hover:border-forest/40 px-6 py-3 rounded-full transition-all"
          >
            Виж пълните описания на всички програми →
          </Link>
        </div>
      </div>
    </section>
  );
}
