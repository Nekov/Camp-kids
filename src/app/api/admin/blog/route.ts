import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { BlogStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      body: data.body,
      author: data.author,
      status: data.status as BlogStatus,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
      tags: data.tags ?? [],
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });
  return NextResponse.json(post);
}
