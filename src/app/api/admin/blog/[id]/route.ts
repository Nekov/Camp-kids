import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { BlogStatus } from "@prisma/client";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      body: data.body,
      author: data.author,
      status: data.status as BlogStatus,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
      tags: data.tags ?? [],
      publishedAt: data.status === "PUBLISHED" ? new Date() : undefined,
    },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
