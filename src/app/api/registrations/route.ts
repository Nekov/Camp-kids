import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Step 1: save children + session
const step1Schema = z.object({
  sessionId: z.string(),
  flowType: z.enum(["A", "B"]),
  children: z.array(z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.string(),
    dietaryNotes: z.string().optional(),
    medicalNotes: z.string().optional(),
  })),
  promoCode: z.string().optional(),
});

// Step 2: parent details
const step2Schema = z.object({
  registrationId: z.string(),
  parentName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  attribution: z.string().optional(),
  notes: z.string().optional(),
});

// Final submit (Flow A)
const submitSchema = z.object({
  registrationId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { step } = body;

    if (step === 1) {
      const data = step1Schema.parse(body);

      // Validate session exists
      const session = await prisma.session.findUnique({
        where: { id: data.sessionId },
        include: { pricingTiers: true },
      });
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      // Determine active tier
      const now = new Date();
      const activeTier =
        session.pricingTiers.find(
          (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > now
        ) ?? session.pricingTiers.find((t) => t.tierType === "STANDARD");

      // Calculate price
      const basePrice = activeTier?.price ?? 0;
      const childCount = data.children.length;
      let totalAmount = basePrice * childCount;

      // Sibling discount
      if (childCount >= 2) {
        totalAmount = basePrice * 1 + basePrice * (childCount - 1) * 0.94;
      }

      // Handle promo code
      let promoCodeRecord = null;
      if (data.promoCode) {
        promoCodeRecord = await prisma.promoCode.findUnique({
          where: { code: data.promoCode.toUpperCase() },
          include: { uses: true },
        });
        if (promoCodeRecord && promoCodeRecord.status === "active") {
          const usesCount = promoCodeRecord.uses.length;
          const maxOk = !promoCodeRecord.maxUses || usesCount < promoCodeRecord.maxUses;
          const dateOk =
            (!promoCodeRecord.validFrom || new Date(promoCodeRecord.validFrom) <= now) &&
            (!promoCodeRecord.validUntil || new Date(promoCodeRecord.validUntil) >= now);
          if (maxOk && dateOk) {
            if (promoCodeRecord.discountType === "percentage") {
              totalAmount *= 1 - promoCodeRecord.discountValue / 100;
            } else {
              totalAmount -= promoCodeRecord.discountValue;
            }
          }
        }
      }

      const registration = await prisma.registration.create({
        data: {
          sessionId: data.sessionId,
          flowType: data.flowType,
          lastStepReached: 1,
          priceTierId: activeTier?.id,
          promoCodeId: promoCodeRecord?.id,
          totalAmount: Math.max(0, Math.round(totalAmount * 100) / 100),
          children: {
            create: data.children.map((child) => ({
              firstName: child.firstName,
              lastName: child.lastName,
              dateOfBirth: new Date(child.dateOfBirth),
              dietaryNotes: child.dietaryNotes,
              medicalNotes: child.medicalNotes,
            })),
          },
        },
      });

      return NextResponse.json({
        registrationId: registration.id,
        totalAmount: registration.totalAmount,
        tierId: activeTier?.id,
        tierType: activeTier?.tierType,
        tierPrice: activeTier?.price,
      });
    }

    if (step === 2) {
      const data = step2Schema.parse(body);

      await prisma.registration.update({
        where: { id: data.registrationId },
        data: {
          parentName: data.parentName,
          email: data.email,
          phone: data.phone,
          attribution: data.attribution,
          notes: data.notes,
          lastStepReached: 2,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (step === "submit") {
      const data = submitSchema.parse(body);

      await prisma.registration.update({
        where: { id: data.registrationId },
        data: {
          status: "FORM_SUBMITTED",
          lastStepReached: 3,
          submittedAt: new Date(),
        },
      });

      // Update session spots taken
      const reg = await prisma.registration.findUnique({ where: { id: data.registrationId }, include: { children: true } });
      if (reg) {
        await prisma.session.update({
          where: { id: reg.sessionId },
          data: {
            spotsTaken: { increment: reg.children.length },
            lastBookingAt: new Date(),
          },
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const reg = await prisma.registration.findUnique({
    where: { id },
    include: { children: true, session: true, priceTier: true, promoCode: true },
  });
  if (!reg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(reg);
}
