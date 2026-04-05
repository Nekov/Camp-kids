export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import BlogPostEditor from "@/components/admin/BlogPostEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BlogEditPage({ params }: Props) {
  const { id } = await params;
  const post = id === "new" ? null : await prisma.blogPost.findUnique({ where: { id } });

  return (
    <div className="max-w-3xl pt-14 lg:pt-0">
      <h1 className="text-xl font-bold text-white mb-6">
        {post ? "Редактиране на публикация" : "Нова публикация"}
      </h1>
      <BlogPostEditor post={post} />
    </div>
  );
}
