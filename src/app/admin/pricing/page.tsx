export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import PricingManager from "@/components/admin/PricingManager";

export default async function PricingPage() {
  const sessions = await prisma.session.findMany({
    include: { pricingTiers: { orderBy: { tierType: "asc" } } },
    where: { status: { not: "ARCHIVED" } },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="max-w-4xl pt-14 lg:pt-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Ценообразуване</h1>
        <p className="text-white/50 text-sm mt-0.5">Управление на ценови категории за всяка сесия</p>
      </div>
      <PricingManager sessions={sessions} />
    </div>
  );
}
