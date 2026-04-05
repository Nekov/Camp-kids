import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { SessionStatus } from "@prisma/client";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  await prisma.session.update({
    where: { id },
    data: {
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      status: data.status as SessionStatus,
      homepageVisible: data.homepageVisible,
      spotsTaken: data.spotsTaken,
      viewersNow: data.viewersNow,
    },
  });

  return NextResponse.json({ success: true });
}
