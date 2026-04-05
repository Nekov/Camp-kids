import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { registrationId } = await req.json();

  const reg = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { session: true, children: true },
  });
  if (!reg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  const childNames = reg.children.map((c) => `${c.firstName} ${c.lastName}`).join(", ");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Депозит — ${reg.session.name}`,
            description: `${childNames} • ${reg.session.name}`,
          },
          unit_amount: 20000, // €200 in cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      registrationId: reg.id,
    },
    customer_email: reg.email ?? undefined,
    success_url: `${siteUrl}/register/${reg.session.slug}/confirmation?id=${reg.id}&payment=success`,
    cancel_url: `${siteUrl}/register/${reg.session.slug}?cancelled=true`,
  });

  await prisma.registration.update({
    where: { id: reg.id },
    data: {
      stripeSessionId: session.id,
      paymentMethod: "STRIPE",
      lastStepReached: 4,
    },
  });

  return NextResponse.json({ url: session.url });
}
