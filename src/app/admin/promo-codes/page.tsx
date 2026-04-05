export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import PromoCodesManager from "@/components/admin/PromoCodesManager";

export default async function PromoCodesPage() {
  const codes = await prisma.promoCode.findMany({
    include: { uses: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Промо кодове</h1>
          <p className="text-white/50 text-sm mt-0.5">{codes.length} кода</p>
        </div>
      </div>
      <PromoCodesManager codes={codes} />
    </div>
  );
}
