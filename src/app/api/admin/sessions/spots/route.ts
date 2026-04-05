import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, spotsTaken } = await req.json();
  await prisma.session.update({
    where: { id: sessionId },
    data: { spotsTaken: Number(spotsTaken) },
  });
  return NextResponse.json({ success: true });
}
