"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PromoCode, PromoCodeUse } from "@prisma/client";
import { Plus, Pause, Play } from "lucide-react";

type PromoWithUses = PromoCode & { uses: PromoCodeUse[] };

export default function PromoCodesManager({ codes }: { codes: PromoWithUses[] }) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 10,
    validUntil: "",
    maxUses: "",
    notes: "",
  });

  async function createCode(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    await fetch("/api/admin/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        validUntil: form.validUntil || null,
      }),
    });
    setCreating(false);
    setShowCreate(false);
    setForm({ code: "", discountType: "percentage", discountValue: 10, validUntil: "", maxUses: "", notes: "" });
    router.refresh();
  }

  async function toggleStatus(id: string, currentStatus: string) {
    await fetch("/api/admin/promo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: currentStatus === "active" ? "paused" : "active" }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowCreate(!showCreate)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold text-sm rounded-xl transition-all"
      >
        <Plus className="w-4 h-4" /> Нов промо код
      </button>

      {showCreate && (
        <form onSubmit={createCode} className="bg-[#1e3a52]/50 rounded-2xl border border-white/10 p-5 space-y-3">
          <h3 className="text-white font-bold text-sm mb-3">Нов промо код</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/60 text-xs mb-1">Код</label>
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50 uppercase" placeholder="SUMMER10" />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Тип отстъпка</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none">
                <option value="percentage">Процент (%)</option>
                <option value="fixed">Фиксирана (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Стойност</label>
              <input type="number" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50" />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Макс. употреби</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50" placeholder="Без ограничение" />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Валиден до</label>
              <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50" />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1">Бележка (вътрешна)</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623]/50" placeholder="За Instagram раздаване" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={creating} className="flex-1 bg-[#f5a623] hover:bg-[#f7b84a] disabled:opacity-50 text-[#0d1b2a] font-bold py-2.5 rounded-xl text-sm">
              {creating ? "Създаване..." : "Създай код"}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white/60 rounded-xl text-sm">
              Отказ
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#1e3a52]/30 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              {["Код", "Отстъпка", "Употреби", "Валиден до", "Бележка", "Статус", ""].map((h) => (
                <th key={h} className="text-left text-white/40 font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code.id} className="border-b border-white/5 hover:bg-white/3">
                <td className="px-4 py-3 text-white font-mono font-bold">{code.code}</td>
                <td className="px-4 py-3 text-[#f5a623] font-semibold">
                  {code.discountType === "percentage" ? `-${code.discountValue}%` : `-€${code.discountValue}`}
                </td>
                <td className="px-4 py-3 text-white/60">
                  {code.uses.length}{code.maxUses ? ` / ${code.maxUses}` : ""}
                </td>
                <td className="px-4 py-3 text-white/40">
                  {code.validUntil ? new Date(code.validUntil).toLocaleDateString("bg-BG") : "—"}
                </td>
                <td className="px-4 py-3 text-white/40 max-w-32 truncate">{code.notes ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${code.status === "active" ? "bg-emerald-500/15 text-emerald-400" : code.status === "paused" ? "bg-amber-500/15 text-amber-400" : "bg-white/10 text-white/40"}`}>
                    {code.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(code.id, code.status)}
                    className="text-white/40 hover:text-white transition-colors"
                    title={code.status === "active" ? "Пауза" : "Активирай"}
                  >
                    {code.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/30">Няма промо кодове</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
