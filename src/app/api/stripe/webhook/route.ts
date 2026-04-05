import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const registrationId = session.metadata?.registrationId;
    if (registrationId) {
      const reg = await prisma.registration.update({
        where: { id: registrationId },
        data: {
          status: "DEPOSIT_PAID",
          paymentMethod: "STRIPE",
          submittedAt: new Date(),
          lastStepReached: 5,
        },
        include: { children: true },
      });

      // Update spots taken
      await prisma.session.update({
        where: { id: reg.sessionId },
        data: {
          spotsTaken: { increment: reg.children.length },
          lastBookingAt: new Date(),
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
