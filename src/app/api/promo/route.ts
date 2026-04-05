import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { code, sessionId } = await req.json();
  if (!code) return NextResponse.json({ valid: false, error: "No code provided" });

  const promo = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase() },
    include: { uses: true },
  });

  if (!promo || promo.status !== "active") {
    return NextResponse.json({ valid: false, error: "Невалиден промо код" });
  }

  const now = new Date();
  if (promo.validFrom && new Date(promo.validFrom) > now) {
    return NextResponse.json({ valid: false, error: "Промо кодът все още не е активен" });
  }
  if (promo.validUntil && new Date(promo.validUntil) < now) {
    return NextResponse.json({ valid: false, error: "Промо кодът е изтекъл" });
  }
  if (promo.maxUses && promo.uses.length >= promo.maxUses) {
    return NextResponse.json({ valid: false, error: "Промо кодът е изчерпан" });
  }
  if (!promo.appliesToAll && sessionId && !promo.sessionIds.includes(sessionId)) {
    return NextResponse.json({ valid: false, error: "Кодът не важи за тази сесия" });
  }

  return NextResponse.json({
    valid: true,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    label: promo.discountType === "percentage"
      ? `-${promo.discountValue}%`
      : `-€${promo.discountValue}`,
  });
}
