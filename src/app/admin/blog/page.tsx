export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Блог</h1>
          <p className="text-white/50 text-sm mt-0.5">{posts.length} публикации</p>
        </div>
        <Link href="/admin/blog/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold text-sm rounded-xl transition-all">
          + Нова публикация
        </Link>
      </div>

      <div className="bg-[#1e3a52]/30 border border-white/10 rounded-2xl overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">Няма публикации</div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                {["Заглавие", "Статус", "Автор", "Дата", ""].map((h) => (
                  <th key={h} className="text-left text-white/40 font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{post.title}</p>
                    <p className="text-white/30 text-xs mt-0.5">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === "PUBLISHED" ? "bg-emerald-500/15 text-emerald-400" :
                      post.status === "SCHEDULED" ? "bg-blue-500/15 text-blue-400" :
                      "bg-white/10 text-white/40"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/50">{post.author}</td>
                  <td className="px-4 py-3 text-white/30">{post.createdAt.toLocaleDateString("bg-BG")}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${post.id}`} className="text-[#f5a623] hover:underline">Редактирай</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
