import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const code = await prisma.promoCode.create({
    data: {
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      maxUses: data.maxUses ?? null,
      notes: data.notes || null,
      status: "active",
      appliesToAll: true,
    },
  });
  return NextResponse.json(code);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  await prisma.promoCode.update({ where: { id }, data: { status } });
  return NextResponse.json({ success: true });
}
