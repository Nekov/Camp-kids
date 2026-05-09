import Link from "next/link";
import { prisma } from "@/lib/db";
import { PROGRAM_GROUPS } from "@/lib/programGroups";
import ProgramGroupCard from "@/components/homepage/ProgramGroupCard";

export default async function SessionGrid() {
  let groupedData: { group: (typeof PROGRAM_GROUPS)[number]; sessions: Awaited<ReturnType<typeof prisma.session.findMany<{ include: { pricingTiers: true } }>>> }[] = [];

  try {
    const sessions = await prisma.session.findMany({
      where: { status: { not: "ARCHIVED" } },
      include: { pricingTiers: true },
      orderBy: [{ displayOrder: "asc" }, { startDate: "asc" }],
    });

    groupedData = PROGRAM_GROUPS.map((group) => ({
      group,
      sessions: sessions.filter((s) => group.sessionSlugs.includes(s.slug)),
    })).filter(({ sessions }) => sessions.length > 0);
  } catch (err) {
    console.error("SessionGrid: DB error", err);
  }

  return (
    <section id="sessions" className="py-20 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Програми 2026
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-light text-forest" style={{ fontFamily: "var(--font-serif)" }}>
            Избери своята програма
          </h2>
          <p className="mt-4 text-moss max-w-2xl mx-auto text-base leading-relaxed">
            Пет творчески програми за различни възрасти и интереси. Всяко място е ограничено —
            максимум 30 деца на сесия.
          </p>
        </div>

        {groupedData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedData.map(({ group, sessions }) => (
              <ProgramGroupCard key={group.slug} group={group} sessions={sessions} />
            ))}
          </div>
        ) : (
          /* Fallback if DB is temporarily unavailable */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAM_GROUPS.map((group) => (
              <Link
                key={group.slug}
                href={`/programs/${group.slug}`}
                className="flex flex-col rounded-2xl bg-cream border border-forest/10 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-forest/20 to-teal/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={group.heroImage}
                    alt={group.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cream to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-forest font-semibold text-base leading-tight">{group.name}</h3>
                    <span className="shrink-0 bg-mint text-fern text-xs px-2.5 py-1 rounded-full border border-teal/15">
                      {group.ageRange}
                    </span>
                  </div>
                  <p className="text-moss/70 text-sm mb-4">{group.tagline}</p>
                  <span className="inline-flex items-center gap-1.5 bg-teal text-white font-semibold text-sm px-5 py-2.5 rounded-full">
                    Виж →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
