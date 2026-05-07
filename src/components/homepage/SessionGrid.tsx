import { prisma } from "@/lib/db";
import { PROGRAM_GROUPS } from "@/lib/programGroups";
import ProgramGroupCard from "@/components/homepage/ProgramGroupCard";

export default async function SessionGrid() {
  const sessions = await prisma.session.findMany({
    where: { status: { not: "ARCHIVED" } },
    include: { pricingTiers: true },
    orderBy: [{ displayOrder: "asc" }, { startDate: "asc" }],
  });

  // Map sessions to groups
  const groupedData = PROGRAM_GROUPS.map((group) => ({
    group,
    sessions: sessions.filter((s) => group.sessionSlugs.includes(s.slug)),
  })).filter(({ sessions }) => sessions.length > 0);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedData.map(({ group, sessions }) => (
            <ProgramGroupCard key={group.slug} group={group} sessions={sessions} />
          ))}
        </div>
      </div>
    </section>
  );
}
