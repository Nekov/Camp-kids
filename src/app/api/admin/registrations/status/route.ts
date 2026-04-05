import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { RegistrationStatus } from "@prisma/client";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  await prisma.registration.update({
    where: { id },
    data: { status: status as RegistrationStatus },
  });
  return NextResponse.json({ success: true });
}
