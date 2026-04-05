"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost, BlogStatus } from "@prisma/client";

export default function BlogPostEditor({ post }: { post: BlogPost | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [author, setAuthor] = useState(post?.author ?? "Мечта в джоба");
  const [status, setStatus] = useState<BlogStatus>(post?.status ?? "DRAFT");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(post?.metaDesc ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function generateSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9\u0400-\u04FF ]/g, "").replace(/\s+/g, "-").slice(0, 80);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const method = post ? "PATCH" : "POST";
    const url = post ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, body, author, status, metaTitle, metaDesc, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (!post) router.push("/admin/blog");
    else router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="bg-[#1e3a52]/50 rounded-2xl border border-white/10 p-5 space-y-4">
        <div>
          <label className="block text-white/60 text-xs mb-1.5">Заглавие *</label>
          <input required value={title} onChange={(e) => { setTitle(e.target.value); if (!post) setSlug(generateSlug(e.target.value)); }}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50" />
        </div>
        <div>
          <label className="block text-white/60 text-xs mb-1.5">Slug / URL</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-[#f5a623]/50" />
        </div>
        <div>
          <label className="block text-white/60 text-xs mb-1.5">Съдържание *</label>
          <textarea required rows={12} value={body} onChange={(e) => setBody(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-[#f5a623]/50 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Автор</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50" />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Статус</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as BlogStatus)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none">
              <option value="DRAFT">Чернова</option>
              <option value="SCHEDULED">Планирана</option>
              <option value="PUBLISHED">Публикувана</option>
            </select>
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1.5">SEO заглавие</label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50" />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Тагове (разделени с ,)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Творчество, Природа, STEAM"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50" />
          </div>
        </div>
        <div>
          <label className="block text-white/60 text-xs mb-1.5">SEO описание</label>
          <textarea rows={2} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 resize-none" />
        </div>
      </div>

      <button type="submit" disabled={saving}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${saved ? "bg-[#2d6a2f] text-white" : "bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a]"} disabled:opacity-50`}>
        {saved ? "✓ Запазено" : saving ? "Запазване..." : "Запази публикацията"}
      </button>
    </form>
  );
}
