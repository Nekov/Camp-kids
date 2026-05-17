import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { registrationId, plan } = await req.json();
  const isFullPayment = plan === "FULL";

  const reg = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { session: true, children: true },
  });
  if (!reg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  const childNames = reg.children.map((c) => `${c.firstName} ${c.lastName}`).join(", ");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://camps.dreaminmypocket.org";

  // Full amount in cents, deposit always €200
  const fullAmountCents = Math.round((reg.totalAmount ?? 0) * 100);
  const depositCents = 20000; // €200
  const chargeAmount = isFullPayment ? fullAmountCents : depositCents;
  const lineItemName = isFullPayment
    ? `Пълно плащане — ${reg.session.name}`
    : `Депозит — ${reg.session.name}`;

  const stripeSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: lineItemName,
            description: `${childNames} • ${reg.session.name}`,
          },
          unit_amount: chargeAmount,
        },
        quantity: 1,
      },
    ],
    metadata: { registrationId: reg.id, plan: plan ?? "DEPOSIT" },
    customer_email: reg.email ?? undefined,
    success_url: `${siteUrl}/register/${reg.session.slug}/confirmation?id=${reg.id}&payment=success&plan=${plan ?? "DEPOSIT"}`,
    cancel_url: `${siteUrl}/register/${reg.session.slug}?cancelled=true`,
  });

  await prisma.registration.update({
    where: { id: reg.id },
    data: {
      stripeSessionId: stripeSession.id,
      paymentMethod: "STRIPE",
      lastStepReached: 4,
    },
  });

  return NextResponse.json({ url: stripeSession.url });
}
